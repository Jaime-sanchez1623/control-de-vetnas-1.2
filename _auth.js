// auth.js - Manejo de autenticación con Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const auth = getAuth(app);

// Manejo de Inicio de Sesión
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Inicio de sesión exitoso");
                window.location.href = "dashboard.html";
            })
            .catch((error) => {
                alert("Error en inicio de sesión: " + error.message);
            });
    });
}

// Manejo de Registro de Usuario
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Registro exitoso");
                window.location.href = "dashboard.html";
            })
            .catch((error) => {
                alert("Error en el registro: " + error.message);
            });
    });
}

// Cerrar Sesión
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        signOut(auth).then(() => {
            alert("Sesión cerrada");
            window.location.href = "index.html";
        });
    });
}
