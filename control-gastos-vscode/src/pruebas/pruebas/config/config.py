"""
Configuración central para las pruebas automatizadas
"""
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))


class Config:
    """Configuración general de pruebas"""

    # URLs
    BASE_URL = os.getenv('BASE_URL', 'http://localhost:5173')
    API_URL = os.getenv('API_URL', 'http://localhost:3000')

    # Credenciales de prueba
    TEST_USER_EMAIL = os.getenv('TEST_USER_EMAIL', 'test@example.com')
    TEST_USER_PASSWORD = os.getenv('TEST_USER_PASSWORD', 'Test123456')
    TEST_USER_NAME = os.getenv('TEST_USER_NAME', 'Usuario Test')
    TEST_USER_CURRENCY = os.getenv('TEST_USER_CURRENCY', 'USD')
    TEST_USER_SALARY = float(os.getenv('TEST_USER_SALARY', '3000'))

    # Selenium
    HEADLESS = os.getenv('HEADLESS', 'false').lower() == 'true'
    BROWSER = os.getenv('BROWSER', 'chrome')
    IMPLICIT_WAIT = int(os.getenv('IMPLICIT_WAIT', '10'))
    PAGE_LOAD_TIMEOUT = int(os.getenv('PAGE_LOAD_TIMEOUT', '30'))
    SCREENSHOT_ON_FAILURE = os.getenv('SCREENSHOT_ON_FAILURE', 'true').lower() == 'true'

    # Locust
    LOCUST_USERS = int(os.getenv('LOCUST_USERS', '50'))
    LOCUST_SPAWN_RATE = int(os.getenv('LOCUST_SPAWN_RATE', '5'))
    LOCUST_RUN_TIME = os.getenv('LOCUST_RUN_TIME', '2m')

    # Directorios
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    REPORTS_DIR = os.path.join(BASE_DIR, 'reports')
    SCREENSHOTS_DIR = os.path.join(REPORTS_DIR, 'screenshots')

    @classmethod
    def ensure_directories(cls):
        """Crear directorios necesarios si no existen"""
        os.makedirs(cls.REPORTS_DIR, exist_ok=True)
        os.makedirs(cls.SCREENSHOTS_DIR, exist_ok=True)


# Crear instancia global
config = Config()
config.ensure_directories()
