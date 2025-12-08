"""
Factory para crear instancias de WebDriver de Selenium
"""
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from config.config import config


class DriverFactory:
    """Factory para crear drivers de Selenium"""

    @staticmethod
    def create_driver(browser=None, headless=None):
        """
        Crear instancia de WebDriver

        Args:
            browser: 'chrome' o 'firefox' (default: desde config)
            headless: True/False (default: desde config)

        Returns:
            WebDriver instance
        """
        browser = browser or config.BROWSER
        headless = headless if headless is not None else config.HEADLESS

        if browser.lower() == 'chrome':
            return DriverFactory._create_chrome_driver(headless)
        elif browser.lower() == 'firefox':
            return DriverFactory._create_firefox_driver(headless)
        else:
            raise ValueError(f"Browser no soportado: {browser}")

    @staticmethod
    def _create_chrome_driver(headless):
        """Crear driver de Chrome"""
        options = ChromeOptions()

        if headless:
            options.add_argument('--headless')

        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        options.add_argument('--window-size=1920,1080')
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_experimental_option('excludeSwitches', ['enable-logging'])

        service = ChromeService(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)

        driver.implicitly_wait(config.IMPLICIT_WAIT)
        driver.set_page_load_timeout(config.PAGE_LOAD_TIMEOUT)

        return driver

    @staticmethod
    def _create_firefox_driver(headless):
        """Crear driver de Firefox"""
        options = FirefoxOptions()

        if headless:
            options.add_argument('--headless')

        options.add_argument('--width=1920')
        options.add_argument('--height=1080')

        service = FirefoxService(GeckoDriverManager().install())
        driver = webdriver.Firefox(service=service, options=options)

        driver.implicitly_wait(config.IMPLICIT_WAIT)
        driver.set_page_load_timeout(config.PAGE_LOAD_TIMEOUT)

        return driver
