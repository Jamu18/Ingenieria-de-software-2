"""
Prueba de carga específica para endpoints de API
"""
from locust import HttpUser, task, between, events
import random
import time


class APILoadTest(HttpUser):
    """
    Prueba de carga enfocada en la API
    Objetivo: Verificar que el tiempo de respuesta sea < 2 segundos con 100 usuarios

    Basado en el objetivo del PDF:
    - 100 usuarios acceden a la vez al sistema
    - Verificar que el tiempo de respuesta sea < 2 segundos
    """

    wait_time = between(1, 2)
    token = None

    def on_start(self):
        """Autenticar usuario"""
        email = f"loadtest_{random.randint(1000, 9999)}@example.com"

        # Registrar
        self.client.post("/api/auth/register", json={
            "email": email,
            "password": "LoadTest123",
            "name": "Load Test User"
        })

        # Login
        response = self.client.post("/api/auth/login", json={
            "email": email,
            "password": "LoadTest123"
        })

        if response.status_code == 200:
            self.token = response.json().get("token")

    @task(5)
    def test_get_expenses_performance(self):
        """
        Prueba: Obtener gastos debe responder en < 2 segundos
        """
        if not self.token:
            return

        start_time = time.time()

        with self.client.get("/api/expenses",
                            headers={"Authorization": f"Bearer {self.token}"},
                            catch_response=True) as response:

            response_time = time.time() - start_time

            if response.status_code == 200:
                if response_time < 2.0:
                    response.success()
                else:
                    response.failure(f"Tiempo de respuesta muy alto: {response_time:.2f}s")
            else:
                response.failure(f"Error HTTP: {response.status_code}")

    @task(3)
    def test_create_expense_performance(self):
        """
        Prueba: Crear gasto debe responder en < 2 segundos
        """
        if not self.token:
            return

        start_time = time.time()

        expense_data = {
            "title": f"Load Test {random.randint(1, 10000)}",
            "amount": random.uniform(10, 100),
            "category": "Otros",
            "date": "2025-12-07"
        }

        with self.client.post("/api/expenses",
                             json=expense_data,
                             headers={"Authorization": f"Bearer {self.token}"},
                             catch_response=True) as response:

            response_time = time.time() - start_time

            if response.status_code in [200, 201]:
                if response_time < 2.0:
                    response.success()
                else:
                    response.failure(f"Tiempo de respuesta muy alto: {response_time:.2f}s")
            else:
                response.failure(f"Error HTTP: {response.status_code}")

    @task(2)
    def test_login_performance(self):
        """
        Prueba: Login debe responder en < 2 segundos
        """
        start_time = time.time()

        with self.client.post("/api/auth/login",
                             json={
                                 "email": "test@example.com",
                                 "password": "Test123456"
                             },
                             catch_response=True) as response:

            response_time = time.time() - start_time

            if response_time < 2.0:
                response.success()
            else:
                response.failure(f"Login muy lento: {response_time:.2f}s")


@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Evento al iniciar las pruebas"""
    print("\n" + "="*60)
    print("INICIANDO PRUEBAS DE RENDIMIENTO")
    print("Objetivo: Tiempo de respuesta < 2 segundos")
    print("="*60 + "\n")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Evento al finalizar las pruebas"""
    print("\n" + "="*60)
    print("PRUEBAS DE RENDIMIENTO FINALIZADAS")
    print("="*60 + "\n")
