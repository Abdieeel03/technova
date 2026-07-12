import { useState } from "react";
import { crearReclamacion } from "../services/reclamacionesApi";
import styles from "../css_components/LibroReclamaciones.module.css";

export default function LibroReclamaciones() {
    const [formulario, setFormulario] = useState({
        nombre: "",
        correo: "",
        telefono: "",
        tipo: "Reclamo",
        motivo: "",
        descripcion: "",
        pedido: "",
    });

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const respuesta = await crearReclamacion(formulario);

            alert(respuesta.mensaje);

            setFormulario({
                nombre: "",
                correo: "",
                telefono: "",
                tipo: "Reclamo",
                motivo: "",
                descripcion: "",
                pedido: "",
            });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Libro de Reclamaciones</h1>

            <p className={styles.subtitle}>
                Si tuvo algún inconveniente con un producto o servicio de TechNova,
                complete el siguiente formulario. Nos comunicaremos con usted lo antes
                posible.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.group}>
                    <label htmlFor="nombre">Nombre completo</label>
                    <input
                        id="nombre"
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.group}>
                        <label htmlFor="correo">Correo electrónico</label>
                        <input
                            id="correo"
                            type="email"
                            name="correo"
                            value={formulario.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            id="telefono"
                            type="text"
                            name="telefono"
                            value={formulario.telefono}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.group}>
                        <label htmlFor="tipo">Tipo de solicitud</label>
                        <select
                            id="tipo"
                            name="tipo"
                            value={formulario.tipo}
                            onChange={handleChange}
                        >
                            <option value="Reclamo">Reclamo</option>
                            <option value="Queja">Queja</option>
                        </select>
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="motivo">Motivo</label>
                        <input
                            id="motivo"
                            type="text"
                            name="motivo"
                            value={formulario.motivo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.group}>
                    <label htmlFor="descripcion">Descripción de lo sucedido</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formulario.descripcion}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.group}>
                    <label htmlFor="pedido">¿Qué solicita?</label>
                    <textarea
                        id="pedido"
                        name="pedido"
                        value={formulario.pedido}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button className={styles.button} type="submit">
                    Enviar reclamo
                </button>
            </form>
        </div>
    );
}