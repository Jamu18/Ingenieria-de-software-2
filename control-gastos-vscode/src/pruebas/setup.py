"""
Setup para el paquete de pruebas
Permite instalar el paquete en modo desarrollo: pip install -e .
"""

from setuptools import setup, find_packages

setup(
    name="pruebas-selenium",
    version="1.0.0",
    description="Suite de pruebas automatizadas con Selenium + Pytest + Locust",
    packages=find_packages(),
    python_requires='>=3.8',
    install_requires=[
        'selenium==4.16.0',
        'webdriver-manager>=4.0.1',
        'locust==2.20.0',
        'pytest==7.4.3',
        'pytest-html==4.1.1',
        'pytest-xdist==3.5.0',
        'python-dotenv==1.0.0',
        'requests==2.31.0',
        'allure-pytest==2.13.2',
    ],
)
