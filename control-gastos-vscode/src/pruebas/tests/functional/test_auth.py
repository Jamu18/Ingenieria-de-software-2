"""
Pruebas funcionales de autenticación
Basadas en los ejemplos del PDF de Selenium + Python
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config.config import config
from utils.helpers import take_screenshot, generate_unique_email


class TestAuthentication:
    """Suite de pruebas de autenticación"""

    def test_01_register_new_user(self, driver_with_screenshot):
        """
        Prueba: Registro de usuario nuevo
        Escenario: Usuario completa formulario de registro exitosamente
        """
        driver = driver_with_screenshot

        try:
            # Navegar a la página de login primero
            driver.get(f"{config.BASE_URL}/login")
            time.sleep(2)

            # Hacer clic en el link "Crear cuenta gratis" para ir a registro
            register_link = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.LINK_TEXT, "Crear cuenta gratis"))
            )
            register_link.click()

            time.sleep(2)

            # Generar datos únicos para la prueba
            unique_email = generate_unique_email()

            # Llenar formulario de registro usando IDs exactos del HTML
            name_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "name"))
            )
            name_input.send_keys(config.TEST_USER_NAME)

            email_input = driver.find_element(By.ID, "email")
            email_input.send_keys(unique_email)

            password_input = driver.find_element(By.ID, "password")
            password_input.send_keys(config.TEST_USER_PASSWORD)

            # Seleccionar moneda (opcional, ya tiene valor por defecto)
            # currency_select = driver.find_element(By.ID, "currency")
            # currency_select.send_keys(config.TEST_USER_CURRENCY)

            # Enviar formulario
            submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_button.click()

            # Esperar redirección al dashboard
            WebDriverWait(driver, 10).until(
                EC.url_contains("/dashboard")
            )

            # Verificar que se registró correctamente
            assert "/dashboard" in driver.current_url, \
                f"No se redirigió al dashboard. URL actual: {driver.current_url}"

            print(f"✓ Usuario registrado exitosamente: {unique_email}")

        except Exception as e:
            take_screenshot(driver, "test_register_new_user_failed")
            raise e

    def test_02_login_valid_credentials(self, driver_with_screenshot):
        """
        Prueba: Inicio de sesión con credenciales válidas
        Escenario: Usuario ingresa credenciales correctas y accede al sistema

        Basado en el ejemplo del PDF:
        driver.get('https://example.com/login')
        driver.find_element(By.ID, 'username').send_keys('usuario_test')
        driver.find_element(By.ID, 'password').send_keys('clave123')
        driver.find_element(By.ID, 'login').click()
        assert 'Bienvenido' in driver.page_source
        """
        driver = driver_with_screenshot

        try:
            # Navegar a la página de login usando IDs exactos del HTML
            driver.get(f"{config.BASE_URL}/login")
            time.sleep(2)

            # Llenar formulario de login usando IDs exactos del HTML
            email_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            email_input.clear()
            email_input.send_keys(config.TEST_USER_EMAIL)

            password_input = driver.find_element(By.ID, "password")
            password_input.clear()
            password_input.send_keys(config.TEST_USER_PASSWORD)

            # Hacer clic en el botón de login
            login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            login_button.click()

            # Esperar redirección al dashboard
            WebDriverWait(driver, 10).until(
                EC.url_contains("/dashboard")
            )

            # Verificar que iniciamos sesión correctamente
            # El texto "Bienvenido" aparece en la página de login, no en el dashboard
            assert "/dashboard" in driver.current_url, \
                f"No se redirigió al dashboard. URL actual: {driver.current_url}"

            print("✓ Login exitoso con credenciales válidas")

        except Exception as e:
            take_screenshot(driver, "test_login_valid_credentials_failed")
            raise e

    def test_03_login_invalid_credentials(self, driver_with_screenshot):
        """
        Prueba: Inicio de sesión con credenciales inválidas
        Escenario: Usuario ingresa credenciales incorrectas y recibe mensaje de error
        """
        driver = driver_with_screenshot

        try:
            # Navegar a la página de login
            driver.get(f"{config.BASE_URL}/login")
            time.sleep(2)

            # Llenar formulario con credenciales incorrectas usando IDs exactos
            email_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            email_input.clear()
            email_input.send_keys("usuario_invalido@test.com")

            password_input = driver.find_element(By.ID, "password")
            password_input.clear()
            password_input.send_keys("password_incorrecto")

            # Hacer clic en el botón de login
            login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            login_button.click()

            # Esperar a que aparezca el mensaje de error
            # El error aparece en un div con clase "bg-red-50"
            error_message = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".bg-red-50"))
            )

            # Verificar que el mensaje de error es visible
            assert error_message.is_displayed(), \
                "El mensaje de error no se muestra"

            print("✓ Mensaje de error mostrado correctamente para credenciales inválidas")

        except Exception as e:
            take_screenshot(driver, "test_login_invalid_credentials_failed")
            raise e

    def test_04_logout(self, driver_with_screenshot):
        """
        Prueba: Cerrar sesión
        Escenario: Usuario cierra sesión y es redirigido al login
        """
        driver = driver_with_screenshot

        try:
            # Primero hacer login usando IDs exactos
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

            # Buscar y hacer clic en botón de logout
            # El botón tiene el texto "Cerrar sesión" dentro del sidebar
            logout_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Cerrar sesión')]"))
            )
            logout_button.click()

            # Esperar redirección al login
            WebDriverWait(driver, 10).until(
                EC.url_contains("/login")
            )

            # Verificar que volvimos al login
            assert "/login" in driver.current_url, \
                f"No se redirigió al login. URL actual: {driver.current_url}"

            print("✓ Logout exitoso")

        except Exception as e:
            take_screenshot(driver, "test_logout_failed")
            raise e

    def test_05_session_persistence(self, driver_with_screenshot):
        """
        Prueba: Persistencia de sesión
        Escenario: Usuario permanece logueado después de refrescar la página
        """
        driver = driver_with_screenshot

        try:
            # Hacer login usando IDs exactos
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

            # Guardar URL del dashboard
            dashboard_url = driver.current_url

            # Refrescar la página
            driver.refresh()
            time.sleep(2)

            # Verificar que sigue en el dashboard (no redirigió a login)
            assert driver.current_url == dashboard_url, \
                f"La sesión no persistió. URL esperada: {dashboard_url}, URL actual: {driver.current_url}"

            print("✓ La sesión persiste correctamente")

        except Exception as e:
            take_screenshot(driver, "test_session_persistence_failed")
            raise e


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
