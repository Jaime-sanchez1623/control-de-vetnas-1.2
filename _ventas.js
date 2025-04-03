// ventas.js - Manejo de ventas en Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import * as XLSX from "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBeFnVErFrfw48BKpcA51VN-2yKNVmC8HU",
    authDomain: "control-de-ventas-4a918.firebaseapp.com",
    projectId: "control-de-ventas-4a918",
    storageBucket: "control-de-ventas-4a918.firebasestorage.app",
    messagingSenderId: "1019052856074",
    appId: "1:1019052856074:web:869da1ec934d61f2ce60f3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Referencia a la colección de ventas
const ventasCollection = collection(db, "ventas");
let ventasChart;

// Manejo de autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("auth-section").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        loadVentas();
    } else {
        document.getElementById("auth-section").style.display = "block";
        document.getElementById("dashboard").style.display = "none";
    }
});

function login(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then(() => alert("Inicio de sesión exitoso"))
        .catch(error => alert("Error: " + error.message));
}

function logout() {
    signOut(auth).then(() => alert("Cierre de sesión exitoso"));
}

// Menú de navegación interactivo
function toggleMenu() {
    const menu = document.getElementById("sidebar");
    menu.classList.toggle("hidden");
}

// Función para cargar ventas con filtro y actualizar gráfico
async function loadVentas(filtroFecha = "") {
    const ventasSnapshot = await getDocs(ventasCollection);
    const ventasList = document.getElementById("ventas-list");
    ventasList.innerHTML = "";
    
    let ventasData = [];
    let totalVentas = 0;
    
    ventasSnapshot.docs.forEach(doc => {
        const venta = doc.data();
        if (!filtroFecha || venta.fecha === filtroFecha) {
            ventasData.push(venta);
            totalVentas += venta.total;
            const row = `<tr class='border-b hover:bg-gray-100 transition duration-300 ease-in-out'>
                <td class='p-3 text-center text-gray-700 font-medium'>${venta.fecha}</td>
                <td class='p-3 text-center font-bold text-blue-600'>${venta.total.toFixed(2)}</td>
                <td class='p-3 text-center'>
                    <button onclick="editVenta('${doc.id}', '${venta.fecha}', ${venta.total})" class='bg-yellow-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300'>Editar</button>
                    <button onclick="deleteVenta('${doc.id}')" class='bg-red-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-600 transition duration-300'>Eliminar</button>
                </td>
            </tr>`;
            ventasList.innerHTML += row;
        }
    });
    
    document.getElementById("totalVentas").innerText = totalVentas.toFixed(2);
    updateChart(ventasData);
}

// Función para actualizar el gráfico
function updateChart(ventasData) {
    const ctx = document.getElementById("ventasChart").getContext("2d");
    const fechas = ventasData.map(v => v.fecha);
    const totales = ventasData.map(v => v.total);

    if (ventasChart) ventasChart.destroy();
    ventasChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Ventas Totales',
                data: totales,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "#333",
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#666"
                    }
                },
                x: {
                    ticks: {
                        color: "#666"
                    }
                }
            }
        }
    });
}

// Eventos
window.onload = () => loadVentas();
document.getElementById("venta-form").addEventListener("submit", saveVenta);
document.getElementById("filter-fecha").addEventListener("change", applyFilter);
document.getElementById("export-excel").addEventListener("click", exportToExcel);
document.getElementById("login-form").addEventListener("submit", login);
document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("menu-toggle").addEventListener("click", toggleMenu);
