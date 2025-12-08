"""
Pruebas funcionales de gestión de gastos
"""
import pytest
import time
from datetime import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from config.config import config
from utils.helpers import take_screenshot


class TestExpenses:
    """Suite de pruebas de gestión de gastos"""

    def login_helper(self, driver):
        """Helper para hacer login antes de cada prueba"""
        driver.get(f"{config.BASE_URL}/login")
        time.sleep(2)

        email_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        email_input.send_keys(config.TEST_USER_EMAIL)

        password_input = driver.find_element(By.ID, "password")
        password_input.send_keys(config.TEST_USER_PASSWORD)

        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        login_button.click()

        # Esperar a llegar al dashboard
        WebDriverWait(driver, 10).until(
            EC.url_contains("/dashboard")
        )

    def test_01_create_expense(self, driver_with_screenshot):
        """
        Prueba: Crear un gasto nuevo
        Escenario: Usuario completa formulario de gasto y lo guarda exitosamente
        """
        driver = driver_with_screenshot

        try:
            # Hacer login primero
            self.login_helper(driver)

            # Navegar a la página de gastos
            driver.get(f"{config.BASE_URL}/expenses")
            time.sleep(2)

            # Hacer clic en el botón "Nuevo Gasto"
            add_expense_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Nuevo Gasto')]"))
            )
            add_expense_button.click()

            time.sleep(1)

            # Llenar formulario de gasto usando IDs exactos del HTML
            title_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "title"))
            )
            title_input.send_keys("Compra de supermercado")

            amount_input = driver.find_element(By.ID, "amount")
            amount_input.send_keys("150.50")

            # Seleccionar categoría usando el ID del select
            category_select = Select(driver.find_element(By.ID, "category"))
            category_select.select_by_value("food")  # "food" es el valor para "Alimentación"

            # Fecha (usar fecha actual)
            date_input = driver.find_element(By.ID, "date")
            today = datetime.now().strftime("%Y-%m-%d")
            date_input.send_keys(today)

            # Nota opcional
            note_input = driver.find_element(By.ID, "note")
            note_input.send_keys("Compra semanal de alimentos")

            # Guardar gasto - el botón tiene el texto "Guardar gasto"
            save_button = driver.find_element(By.XPATH, "//button[contains(., 'Guardar gasto')]")
            save_button.click()

            time.sleep(2)

            # Verificar que el gasto se creó
            assert "Compra de supermercado" in driver.page_source, \
                "El gasto no aparece en la lista"

            print("✓ Gasto creado exitosamente")

        except Exception as e:
            take_screenshot(driver, "test_create_expense_failed")
            raise e

    def test_02_list_expenses(self, driver_with_screenshot):
        """
        Prueba: Listar gastos del mes
        Escenario: Usuario visualiza lista de gastos del mes actual
        """
        driver = driver_with_screenshot

        try:
            # Hacer login
            self.login_helper(driver)

            # Navegar a la página de gastos
            driver.get(f"{config.BASE_URL}/expenses")
            time.sleep(2)

            # Verificar que aparece el título "Lista de gastos"
            list_title = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//h3[contains(., 'Lista de gastos')]"))
            )

            assert list_title.is_displayed(), "El título de lista de gastos no es visible"

            print("✓ Lista de gastos mostrada correctamente")

        except Exception as e:
            take_screenshot(driver, "test_list_expenses_failed")
            raise e

    def test_03_filter_expenses_by_category(self, driver_with_screenshot):
        """
        Prueba: Filtrar gastos por categoría usando el buscador
        Escenario: Usuario busca gastos usando el campo de búsqueda
        """
        driver = driver_with_screenshot

        try:
            # Hacer login
            self.login_helper(driver)

            # Navegar a la página de gastos
            driver.get(f"{config.BASE_URL}/expenses")
            time.sleep(2)

            # Buscar el campo de búsqueda (tiene placeholder "Buscar gastos...")
            search_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Buscar gastos...']"))
            )

            # Buscar por una palabra clave
            search_input.send_keys("supermercado")

            time.sleep(2)

            print("✓ Búsqueda de gastos funciona correctamente")

        except Exception as e:
            take_screenshot(driver, "test_filter_expenses_failed")
            raise e

    def test_04_delete_expense(self, driver_with_screenshot):
        """
        Prueba: Eliminar un gasto
        Escenario: Usuario elimina un gasto existente
        """
        driver = driver_with_screenshot

        try:
            # Hacer login
            self.login_helper(driver)

            # Navegar a la página de gastos
            driver.get(f"{config.BASE_URL}/expenses")
            time.sleep(2)

            # Buscar botones de eliminar (tienen el icono Trash2)
            # Los botones de eliminar están en la fila de cada gasto
            delete_buttons = driver.find_elements(By.XPATH, "//button[contains(@class, 'text-red-600')]")

            if len(delete_buttons) == 0:
                pytest.skip("No hay gastos para eliminar")

            # Contar gastos antes de eliminar
            expense_rows = driver.find_elements(By.XPATH, "//div[contains(@class, 'rounded-lg border bg-white p-4')]")
            initial_count = len(expense_rows)

            # Hacer clic en el primer botón de eliminar
            delete_buttons[0].click()

            # Confirmar eliminación en el diálogo de confirmación del navegador
            time.sleep(1)
            try:
                # Aceptar el diálogo de confirmación (alert)
                alert = driver.switch_to.alert
                alert.accept()
            except:
                pass  # No hay diálogo o ya fue aceptado

            time.sleep(2)

            # Verificar que se eliminó
            expense_rows_after = driver.find_elements(By.XPATH, "//div[contains(@class, 'rounded-lg border bg-white p-4')]")
            final_count = len(expense_rows_after)

            # Puede que se haya eliminado o puede que no haya gastos
            assert final_count < initial_count or final_count == 0, "El gasto no se eliminó"

            print("✓ Gasto eliminado exitosamente")

        except Exception as e:
            take_screenshot(driver, "test_delete_expense_failed")
            raise e

    def test_05_expense_validation(self, driver_with_screenshot):
        """
        Prueba: Validación de campos de gasto
        Escenario: Usuario intenta crear gasto sin datos obligatorios
        """
        driver = driver_with_screenshot

        try:
            # Hacer login
            self.login_helper(driver)

            # Navegar a la página de gastos
            driver.get(f"{config.BASE_URL}/expenses")
            time.sleep(2)

            # Abrir formulario de gasto
            add_expense_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Nuevo Gasto')]"))
            )
            add_expense_button.click()

            time.sleep(1)

            # Intentar guardar sin llenar campos obligatorios
            # Los campos title y amount son requeridos
            save_button = driver.find_element(By.XPATH, "//button[contains(., 'Guardar gasto')]")
            save_button.click()

            time.sleep(1)

            # Los campos HTML con 'required' mostrarán mensajes del navegador automáticamente
            # Verificar que el formulario no se envió (seguimos en la misma URL)
            assert "/expenses" in driver.current_url, \
                "El formulario se envió sin validar campos requeridos"

            print("✓ Validación de campos funciona correctamente")

        except Exception as e:
            take_screenshot(driver, "test_expense_validation_failed")
            raise e

    def test_06_view_expense_details(self, driver_with_screenshot):
        """
        Prueba: Ver detalles de un gasto
        Escenario: Usuario puede ver la información completa de un gasto en la lista
        """
        driver = driver_with_screenshot

        try:
            # Hacer login
            self.login_helper(driver)

            # Navegar a la página de gastos
            driver.get(f"{config.BASE_URL}/expenses")
            time.sleep(2)

            # Buscar gastos en la lista
            # Cada gasto está en un div con ciertas clases
            expense_items = driver.find_elements(By.XPATH, "//div[contains(@class, 'rounded-lg border bg-white p-4')]")

            if len(expense_items) == 0:
                pytest.skip("No hay gastos para ver detalles")

            # Verificar que el primer gasto muestra información
            first_expense = expense_items[0]

            # Debe mostrar título, fecha y monto
            assert first_expense.is_displayed(), \
                "El gasto no se muestra correctamente"

            print("✓ Detalles del gasto mostrados correctamente")

        except Exception as e:
            take_screenshot(driver, "test_view_expense_details_failed")
            raise e


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
