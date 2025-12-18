"""
Pruebas de rendimiento con Locust
Basadas en los ejemplos del PDF de Locust + Python

Ejecución:
    locust -f locustfile.py --host http://localhost:3000
    Luego abrir http://localhost:8089
"""
from locust import HttpUser, task, between
import random
import json


class ExpenseTrackingUser(HttpUser):
    """
    Simula un usuario del sistema de control de gastos

    Basado en el ejemplo del PDF:
    class UsuarioFormulario(HttpUser):
        wait_time = between(1, 3)
        @task
        def cargar_formulario(self):
            self.client.get("/selenium/web/web-form.html")
    """

    # Tiempo de espera entre tareas (simula tiempo de usuario real)
    wait_time = between(1, 3)

    # Token de autenticación (se obtiene en on_start)
    token = None
    user_id = None

    def on_start(self):
        """
        Se ejecuta cuando el usuario simulado inicia
        Hace login y obtiene token
        """
        # Datos de login
        login_data = {
            "email": f"test_{random.randint(1000, 9999)}@example.com",
            "password": "Test123456"
        }

        # Intentar registrar usuario (puede fallar si ya existe, está ok)
        register_data = {
            **login_data,
            "name": "Usuario Test",
            "currency": "USD"
        }

        with self.client.post("/api/auth/register",
                              json=register_data,
                              catch_response=True) as response:
            if response.status_code == 201 or response.status_code == 200:
                response.success()
            else:
                # Si falla el registro, probablemente el usuario ya existe
                response.failure("Usuario ya existe o error en registro")

        # Hacer login
        with self.client.post("/api/auth/login",
                              json=login_data,
                              catch_response=True) as response:
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("token")
                self.user_id = data.get("user", {}).get("id")
                response.success()
            else:
                response.failure(f"Login falló: {response.status_code}")

    def get_headers(self):
        """Obtener headers con autenticación"""
        if self.token:
            return {
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json"
            }
        return {"Content-Type": "application/json"}

    @task(3)
    def get_expenses(self):
        """
        Tarea: Obtener lista de gastos
        Peso: 3 (se ejecuta más frecuentemente)
        """
        with self.client.get("/api/expenses",
                            headers=self.get_headers(),
                            catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Error al obtener gastos: {response.status_code}")

    @task(2)
    def create_expense(self):
        """
        Tarea: Crear un gasto nuevo
        Peso: 2
        """
        categories = ["Alimentación", "Transporte", "Salud", "Entretenimiento", "Otros"]
        expense_data = {
            "title": f"Gasto Test {random.randint(1, 1000)}",
            "amount": round(random.uniform(10, 500), 2),
            "currency": "USD",
            "category": random.choice(categories),
            "date": "2025-12-07",
            "note": "Gasto generado por prueba de rendimiento"
        }

        with self.client.post("/api/expenses",
                             json=expense_data,
                             headers=self.get_headers(),
                             catch_response=True) as response:
            if response.status_code == 201 or response.status_code == 200:
                response.success()
            else:
                response.failure(f"Error al crear gasto: {response.status_code}")

    @task(1)
    def get_user_profile(self):
        """
        Tarea: Obtener perfil de usuario
        Peso: 1
        """
        with self.client.get("/api/auth/me",
                            headers=self.get_headers(),
                            catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Error al obtener perfil: {response.status_code}")

    @task(1)
    def update_settings(self):
        """
        Tarea: Actualizar configuración de usuario
        Peso: 1
        """
        settings_data = {
            "monthly_salary": round(random.uniform(2000, 5000), 2),
            "currency": random.choice(["USD", "EUR", "PEN"])
        }

        with self.client.put("/api/auth/settings",
                            json=settings_data,
                            headers=self.get_headers(),
                            catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Error al actualizar configuración: {response.status_code}")


class QuickTestUser(HttpUser):
    """
    Usuario para pruebas rápidas de carga
    Solo hace peticiones GET (menos carga en la BD)
    """
    wait_time = between(0.5, 2)

    @task
    def load_homepage(self):
        """Cargar página principal"""
        self.client.get("/")

    @task
    def load_api_health(self):
        """Verificar salud de la API"""
        with self.client.get("/api/health",
                            catch_response=True) as response:
            if response.status_code == 200 or response.status_code == 404:
                # 404 está ok si no tienes endpoint de health
                response.success()
            else:
                response.failure(f"Error: {response.status_code}")


# Configuración para ejecución por línea de comandos
# Ejecutar con:
# locust -f locustfile.py --headless --users 50 --spawn-rate 5 --host http://localhost:3000 --run-time 2m
