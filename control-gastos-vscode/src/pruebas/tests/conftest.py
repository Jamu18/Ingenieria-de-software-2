"""
Configuración de fixtures para pytest
"""
import pytest
from datetime import datetime
from utils.driver_factory import DriverFactory
from utils.helpers import take_screenshot
from config.config import config


@pytest.fixture(scope='function')
def driver():
    """
    Fixture para crear y destruir driver de Selenium
    Se ejecuta para cada test
    """
    driver = DriverFactory.create_driver()
    driver.get(config.BASE_URL)

    yield driver

    driver.quit()


@pytest.fixture(scope='function')
def driver_with_screenshot(request):
    """
    Fixture que toma screenshot en caso de fallo
    """
    driver = DriverFactory.create_driver()
    driver.get(config.BASE_URL)

    yield driver

    # Si el test falló, tomar screenshot
    if request.node.rep_call.failed:
        take_screenshot(driver, request.node.name)

    driver.quit()


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """
    Hook para capturar resultado del test
    """
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)


@pytest.fixture(scope='session')
def base_url():
    """Fixture para obtener URL base"""
    return config.BASE_URL


@pytest.fixture(scope='session')
def api_url():
    """Fixture para obtener URL de API"""
    return config.API_URL


# Personalización del reporte HTML en español
def pytest_html_report_title(report):
    """Personalizar el título del reporte HTML"""
    report.title = "Reporte de Pruebas Automatizadas"


def pytest_configure(config):
    """Configurar metadatos del reporte en español"""
    # Crear _metadata si no existe
    if not hasattr(config, '_metadata'):
        config._metadata = {}

    config._metadata['Proyecto'] = 'Sistema de Control de Gastos'
    config._metadata['Entorno'] = 'Desarrollo'
    config._metadata['Fecha de Ejecución'] = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
    config._metadata['Backend'] = 'http://localhost:3000'
    config._metadata['Frontend'] = 'http://localhost:5174'


def pytest_html_results_table_header(cells):
    """Personalizar encabezados de la tabla en español"""
    cells.insert(2, '<th>Descripción</th>')
    cells.insert(1, '<th class="sortable time" data-column-type="time">Duración</th>')


def pytest_html_results_table_row(report, cells):
    """Personalizar filas de la tabla"""
    cells.insert(2, f'<td>{report.nodeid}</td>')
    cells.insert(1, f'<td class="col-time">{getattr(report, "duration", 0):.2f}s</td>')
