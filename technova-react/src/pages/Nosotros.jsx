export default function Nosotros() {
  return (
    <>
      <div className="nosotros-header">
        <h1>Sobre Nosotros</h1>
        <p>
          Conoce más sobre TechNova y el equipo que hace posible tu experiencia
          tecnológica
        </p>
      </div>

      <section className="empresa-info">
        <div className="empresa-descripcion">
          <h2>¿Quiénes Somos?</h2>
          <p>
            TechNova es una empresa especializada en la comercialización de
            accesorios tecnológicos y dispositivos electrónicos innovadores para
            uso cotidiano. Nos dedicamos a seleccionar y ofrecer productos que
            mejoran la productividad, conectividad y experiencia digital de
            nuestros clientes, con un enfoque en calidad, funcionalidad y diseño
            contemporáneo. Desde nuestros inicios, nos hemos comprometido con la
            excelencia y la satisfacción del cliente, ofreciendo productos de
            las mejores marcas y un servicio personalizado que supera las
            expectativas.
          </p>
        </div>

        <div className="mision-vision-container">
          <div className="mision-card">
            <h3>
              <i className="fa-solid fa-bullseye"></i>
              Misión
            </h3>
            <p>
              Ofrecer a nuestros clientes una amplia gama de productos
              tecnológicos innovadores y de calidad que les permitan optimizar
              sus actividades cotidianas, mejorar su eficiencia personal y
              profesional, y disfrutar de una experiencia tecnológica integral,
              accesible y satisfactoria. Nos esforzamos por ser el socio
              confiable en el mundo de la tecnología, brindando soluciones que
              transforman vidas.
            </p>
          </div>

          <div className="vision-card">
            <h3>
              <i className="fa-solid fa-eye"></i>
              Visión
            </h3>
            <p>
              Liderar el mercado de accesorios tecnológicos mediante la
              selección cuidadosa de productos, la excelencia en servicio al
              cliente y la adaptación constante a las nuevas tendencias
              tecnológicas, diferenciándonos por nuestra capacidad de anticipar
              y satisfacer las necesidades evolutivas de usuarios digitales.
              Aspiramos a ser reconocidos como la primera opción cuando se trata
              de innovación y calidad tecnológica.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
