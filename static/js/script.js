
(() => {
    const $ = (selector) => document.querySelector(selector);

    const pantallas = ["portada", "carta", "cumple", "regalo"];
    const musica = $("#piano");
    const estadoMusica = $("#estado-musica");
    const canvas = $("#confeti");
    const ctx = canvas.getContext("2d");

    let particulas = [];
    let animacion = null;
    let musicaDisponible = true;

    function mostrarPantalla(id) {
        pantallas.forEach(nombre => {
            document.getElementById(nombre)
                .classList.toggle("oculta", nombre !== id);
        });

        window.scrollTo({ top: 0, behavior: "smooth" });

        if (id === "cumple") {
            setTimeout(() => lanzarConfeti(90), 400);
        }
    }

    $("#comenzar").addEventListener("click", () => {
        mostrarPantalla("carta");
    });

    document.querySelectorAll("[data-ir]").forEach(boton => {
        boton.addEventListener("click", () => {
            mostrarPantalla(boton.dataset.ir);
        });
    });

    $("#boton-musica").addEventListener("click", async () => {
        if (!musicaDisponible) {
            estadoMusica.textContent =
                "Coloca musica.mp3 en static/audio/";
            return;
        }

        if (musica.paused) {
            try {
                await musica.play();
                estadoMusica.textContent = "Piano reproduciéndose";
            } catch (error) {
                estadoMusica.textContent =
                    "Añade tu archivo musica.mp3";
            }
        } else {
            musica.pause();
            estadoMusica.textContent = "Activar música";
        }
    });

    musica.addEventListener("error", () => {
        musicaDisponible = false;
        estadoMusica.textContent = "Añade tu piano en audio/";
    });

    $("#apagar").addEventListener("click", () => {
        const llamas = document.querySelectorAll(".llama");
        const estabanApagadas = [...llamas].every(
            llama => llama.classList.contains("apagada")
        );

        llamas.forEach(llama => {
            llama.classList.toggle("apagada", !estabanApagadas);
        });

        $("#mensaje-torta").textContent = estabanApagadas
            ? "Enciende tu ilusión y vuelve a pedir un deseo. ✨"
            : "Que ese deseo encuentre su camino hasta hacerse realidad. ❤️";

        if (!estabanApagadas) lanzarConfeti(160);
    });

    $("#celebrar").addEventListener("click", () => {
        lanzarConfeti(230);
    });

    $("#caja-regalo").addEventListener("click", () => {
        $("#caja-regalo").classList.add("abierta");
        $("#mensaje-secreto").classList.remove("oculta");
        $("#reiniciar").classList.remove("oculta");

        lanzarConfeti(200);

        setTimeout(() => {
            $("#mensaje-secreto").scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 250);
    });

    $("#reiniciar").addEventListener("click", () => {
        $("#caja-regalo").classList.remove("abierta");
        $("#mensaje-secreto").classList.add("oculta");
        $("#reiniciar").classList.add("oculta");

        document.querySelectorAll(".llama").forEach(llama => {
            llama.classList.remove("apagada");
        });

        $("#mensaje-torta").textContent =
            "Tres pequeñas luces para todos tus deseos.";

        mostrarPantalla("portada");
    });

    function ajustarCanvas() {
        const escala = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = window.innerWidth * escala;
        canvas.height = window.innerHeight * escala;

        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        ctx.setTransform(escala, 0, 0, escala, 0, 0);
    }

    window.addEventListener("resize", ajustarCanvas);
    ajustarCanvas();

    function lanzarConfeti(cantidad = 100) {
        const colores = [
            "#e8c77e",
            "#f4e6c8",
            "#b7435b",
            "#d58a8f",
            "#fff3df"
        ];

        for (let i = 0; i < cantidad; i++) {
            particulas.push({
                x: Math.random() * window.innerWidth,
                y: -20 - Math.random() * 200,
                vx: (Math.random() - 0.5) * 4,
                vy: 2 + Math.random() * 4,
                tamano: 3 + Math.random() * 5,
                color: colores[
                    Math.floor(Math.random() * colores.length)
                ],
                giro: Math.random() * 6,
                vida: 200
            });
        }

        if (!animacion) dibujarConfeti();
    }

    function dibujarConfeti() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        particulas = particulas.filter(p =>
            p.vida > 0 && p.y < window.innerHeight + 30
        );

        particulas.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.018;
            p.giro += 0.05;
            p.vida--;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.giro);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.min(1, p.vida / 35);
            ctx.fillRect(
                -p.tamano / 2,
                -p.tamano / 3,
                p.tamano,
                p.tamano * 0.7
            );
            ctx.restore();
        });

        if (particulas.length > 0) {
            animacion = requestAnimationFrame(dibujarConfeti);
        } else {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            animacion = null;
        }
    }
})();
