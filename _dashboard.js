// dashboard.js - Manejo del panel de reportes

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import moment from "https://cdn.jsdelivr.net/npm/moment/moment.min.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Obtener datos de Firestore y generar el gráfico
async function loadSalesData() {
    const salesCollection = collection(db, "ventas");
    const salesSnapshot = await getDocs(salesCollection);
    const salesData = salesSnapshot.docs.map(doc => doc.data());
    
    // Procesar datos para el gráfico
    const salesByDate = {};
    salesData.forEach(sale => {
        const date = moment(sale.fecha).format('YYYY-MM-DD');
        salesByDate[date] = (salesByDate[date] || 0) + sale.total;
    });
    
    // Configurar datos para Chart.js
    const labels = Object.keys(salesByDate);
    const data = Object.values(salesByDate);

    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas Diarias',
                data: data,
                borderColor: 'blue',
                borderWidth: 2,
                fill: false
            }]
        }
    });
}

// Cargar datos al iniciar
document.addEventListener("DOMContentLoaded", loadSalesData);
