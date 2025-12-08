"""
Funciones auxiliares para las pruebas
"""
import os
import time
from datetime import datetime
from config.config import config


def take_screenshot(driver, name):
    """
    Tomar captura de pantalla

    Args:
        driver: WebDriver instance
        name: Nombre descriptivo para la captura
    """
    if not config.SCREENSHOT_ON_FAILURE:
        return

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{name}_{timestamp}.png"
    filepath = os.path.join(config.SCREENSHOTS_DIR, filename)

    driver.save_screenshot(filepath)
    print(f"Screenshot guardado: {filepath}")
    return filepath


def wait_for_page_load(driver, timeout=10):
    """
    Esperar a que la página cargue completamente

    Args:
        driver: WebDriver instance
        timeout: Tiempo máximo de espera en segundos
    """
    from selenium.webdriver.support.ui import WebDriverWait

    WebDriverWait(driver, timeout).until(
        lambda d: d.execute_script('return document.readyState') == 'complete'
    )


def get_current_timestamp():
    """Obtener timestamp actual"""
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')


def generate_unique_email():
    """Generar email único para pruebas"""
    timestamp = int(time.time())
    return f"test_{timestamp}@example.com"


def format_currency(amount, currency='USD'):
    """
    Formatear cantidad como moneda

    Args:
        amount: Cantidad numérica
        currency: Código de moneda

    Returns:
        String formateado
    """
    symbols = {
        'USD': '$',
        'EUR': '€',
        'PEN': 'S/',
        'MXN': '$'
    }

    symbol = symbols.get(currency, currency)
    return f"{symbol}{amount:.2f}"


def clean_test_data(driver, email):
    """
    Limpiar datos de prueba (si es necesario)

    Args:
        driver: WebDriver instance
        email: Email del usuario de prueba
    """
    # Implementar lógica de limpieza si es necesario
    pass
