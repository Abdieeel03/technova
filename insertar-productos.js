import { MongoClient } from "mongodb";
import dns from "node:dns/promises";
import "dotenv/config";

// Workaround para bug de DNS en Windows con mongodb+srv://
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "technova-products";

if (!uri) {
  throw new Error("Falta MONGODB_URI en el .env");
}

const nuevosProductos = [
  // ───────── LAPTOPS ─────────
  {
    nombre: "Laptop MSI Katana 15",
    marca: "MSI",
    categoria: "laptops",
    precio: 1299.99,
    imagen: "/img/productos/msi-katana15.webp",
    descripcion: "Laptop gamer con RTX 4060 y procesador Intel Core i7 de 13a gen.",
    descripcionDetallada: "La MSI Katana 15 combina rendimiento gamer con un diseño portátil. Equipada con Intel Core i7-13620H, RTX 4060 y pantalla de 144Hz, está lista para los juegos más exigentes.",
    caracteristicas: [
      "Intel Core i7-13620H",
      "NVIDIA RTX 4060 8GB",
      "Pantalla 15.6\" 144Hz Full HD",
      "16GB RAM DDR5",
      "SSD NVMe 1TB",
      "Teclado retroiluminado RGB"
    ],
    especificaciones: {
      "Procesador": "Intel Core i7-13620H",
      "GPU": "RTX 4060 8GB",
      "RAM": "16GB DDR5",
      "Almacenamiento": "1TB NVMe SSD",
      "Pantalla": "15.6\" 144Hz FHD"
    },
    stock: 6,
    garantia: "12 meses",
    ofertaNavideña: { activa: true, descuento: 15, precioOriginal: 1299.99, precioOferta: 1104.99, fechaInicio: "2025-12-01", fechaFin: "2025-12-31", etiqueta: "Black Friday" }
  },
  {
    nombre: "Laptop ASUS ROG Strix G16",
    marca: "ASUS",
    categoria: "laptops",
    precio: 1799.99,
    imagen: "/img/productos/asus-rog-strix-g16.webp",
    descripcion: "Laptop gamer premium con RTX 4070 y pantalla de 240Hz.",
    descripcionDetallada: "La ASUS ROG Strix G16 ofrece rendimiento de escritorio en formato portátil. Con RTX 4070, Intel Core i9 y pantalla QHD de 240Hz, es ideal para gaming competitivo y creación de contenido.",
    caracteristicas: [
      "Intel Core i9-13980HX",
      "NVIDIA RTX 4070 8GB",
      "Pantalla 16\" QHD 240Hz",
      "32GB RAM DDR5",
      "SSD NVMe 1TB",
      "Sistema de refrigeración ROG Intelligent Cooling"
    ],
    especificaciones: {
      "Procesador": "Intel Core i9-13980HX",
      "GPU": "RTX 4070 8GB",
      "RAM": "32GB DDR5",
      "Almacenamiento": "1TB NVMe SSD",
      "Pantalla": "16\" QHD 240Hz"
    },
    stock: 4,
    garantia: "24 meses",
    ofertaNavideña: { activa: false, descuento: 0, precioOriginal: 1799.99, precioOferta: 1799.99, fechaInicio: null, fechaFin: null, etiqueta: null }
  },
  {
    nombre: "Laptop Xiaomi RedmiBook Pro 15",
    marca: "Xiaomi",
    categoria: "laptops",
    precio: 799.99,
    imagen: "/img/productos/xiaomi-redmibook-pro15.webp",
    descripcion: "Laptop ultradelgada con pantalla 2.5K táctil y procesador Intel Core i5.",
    descripcionDetallada: "La RedmiBook Pro 15 combina diseño elegante con gran rendimiento. Pantalla 2.5K con 100% sRGB, procesador Intel Core i5 de 12a generación y chasis de aluminio ultradelgado.",
    caracteristicas: [
      "Intel Core i5-12450H",
      "Pantalla 2.5K táctil 100% sRGB",
      "16GB RAM LPDDR5",
      "SSD NVMe 512GB",
      "Chasis de aluminio",
      "Batería de 70Wh"
    ],
    especificaciones: {
      "Procesador": "Intel Core i5-12450H",
      "RAM": "16GB LPDDR5",
      "Almacenamiento": "512GB NVMe SSD",
      "Pantalla": "15.6\" 2.5K Táctil",
      "Peso": "1.8kg"
    },
    stock: 9,
    garantia: "12 meses",
    ofertaNavideña: { activa: true, descuento: 18, precioOriginal: 799.99, precioOferta: 655.99, fechaInicio: "2025-12-01", fechaFin: "2025-12-31", etiqueta: "Oferta" }
  },
  {
    nombre: "Laptop Gamer MSI Stealth 16",
    marca: "MSI",
    categoria: "laptops",
    precio: 2199.99,
    imagen: "/img/productos/msi-stealth16.webp",
    descripcion: "Laptop premium ultradelgada con RTX 4080 para gaming y creación de contenido.",
    descripcionDetallada: "La MSI Stealth 16 combina elegancia y potencia bruta. Con RTX 4080, pantalla Mini LED de 240Hz y chasis CNC de aluminio, es de las laptops más codiciadas para profesionales y gamers.",
    caracteristicas: [
      "Intel Core i9-13900H",
      "NVIDIA RTX 4080 12GB",
      "Pantalla Mini LED 16\" 240Hz",
      "32GB RAM DDR5",
      "SSD NVMe 2TB",
      "Chasis CNC de aluminio"
    ],
    especificaciones: {
      "Procesador": "Intel Core i9-13900H",
      "GPU": "RTX 4080 12GB",
      "RAM": "32GB DDR5",
      "Almacenamiento": "2TB NVMe SSD",
      "Pantalla": "16\" Mini LED 240Hz"
    },
    stock: 2,
    garantia: "24 meses",
    ofertaNavideña: { activa: false, descuento: 0, precioOriginal: 2199.99, precioOferta: 2199.99, fechaInicio: null, fechaFin: null, etiqueta: null }
  },
  {
    nombre: "Laptop Corsair Voyager a1600",
    marca: "Corsair",
    categoria: "laptops",
    precio: 2499.99,
    imagen: "/img/productos/corsair-voyager-a1600.webp",
    descripcion: "Laptop gamer con AMD Ryzen 9 y gráficos Radeon RX 7600M XT.",
    descripcionDetallada: "La Corsair Voyager a1600 es la primera laptop gamer de Corsair. Con AMD Ryzen 9 7940HS, Radeon RX 7600M XT y un trackpad con iluminación RGB integrada, redefine el diseño gamer.",
    caracteristicas: [
      "AMD Ryzen 9 7940HS",
      "AMD Radeon RX 7600M XT",
      "Pantalla 16\" QHD+ 240Hz",
      "32GB RAM DDR5",
      "SSD NVMe 2TB",
      "Trackpad RGB iCUE"
    ],
    especificaciones: {
      "Procesador": "AMD Ryzen 9 7940HS",
      "GPU": "Radeon RX 7600M XT",
      "RAM": "32GB DDR5",
      "Almacenamiento": "2TB NVMe SSD",
      "Pantalla": "16\" QHD+ 240Hz"
    },
    stock: 3,
    garantia: "24 meses",
    ofertaNavideña: { activa: true, descuento: 12, precioOriginal: 2499.99, precioOferta: 2199.99, fechaInicio: "2025-12-01", fechaFin: "2025-12-31", etiqueta: "Black Friday" }
  },
  {
    nombre: "Laptop ASRock Pearl",
    marca: "ASRock",
    categoria: "laptops",
    precio: 1099.99,
    imagen: "/img/productos/asrock-pearl.webp",
    descripcion: "Laptop equilibrada con AMD Ryzen 7 para productividad y gaming casual.",
    descripcionDetallada: "La ASRock Pearl ofrece un balance entre productividad y gaming ligero. Con AMD Ryzen 7 7840HS y gráficos integrados Radeon 780M, es ideal para trabajo y entretenimiento diario.",
    caracteristicas: [
      "AMD Ryzen 7 7840HS",
      "AMD Radeon 780M integrada",
      "Pantalla 14\" Full HD IPS",
      "16GB RAM DDR5",
      "SSD NVMe 512GB",
      "Batería de larga duración"
    ],
    especificaciones: {
      "Procesador": "AMD Ryzen 7 7840HS",
      "GPU": "Radeon 780M integrada",
      "RAM": "16GB DDR5",
      "Almacenamiento": "512GB NVMe SSD",
      "Pantalla": "14\" Full HD IPS"
    },
    stock: 7,
    garantia: "12 meses",
    ofertaNavideña: { activa: false, descuento: 0, precioOriginal: 1099.99, precioOferta: 1099.99, fechaInicio: null, fechaFin: null, etiqueta: null }
  },
  {
    nombre: "Laptop Gamer HyperX Edition ASUS TUF",
    marca: "ASUS",
    categoria: "laptops",
    precio: 1399.99,
    imagen: "/img/productos/asus-tuf-hyperx.webp",
    descripcion: "Laptop gamer robusta con RTX 4060 y certificación militar MIL-STD-810H.",
    descripcionDetallada: "La ASUS TUF Gaming A15 está construida para resistir. Con certificación militar de durabilidad, RTX 4060 y AMD Ryzen 7, ofrece rendimiento confiable sin sacrificar resistencia.",
    caracteristicas: [
      "AMD Ryzen 7 7735HS",
      "NVIDIA RTX 4060 8GB",
      "Pantalla 15.6\" 144Hz FHD",
      "16GB RAM DDR5",
      "Certificación militar MIL-STD-810H",
      "Teclado retroiluminado de un solo color"
    ],
    especificaciones: {
      "Procesador": "AMD Ryzen 7 7735HS",
      "GPU": "RTX 4060 8GB",
      "RAM": "16GB DDR5",
      "Almacenamiento": "1TB NVMe SSD",
      "Pantalla": "15.6\" 144Hz FHD"
    },
    stock: 8,
    garantia: "12 meses",
    ofertaNavideña: { activa: true, descuento: 20, precioOriginal: 1399.99, precioOferta: 1119.99, fechaInicio: "2025-12-01", fechaFin: "2025-12-31", etiqueta: "Oferta" }
  },
  {
    nombre: "Laptop Razer Blade 14",
    marca: "Razer",
    categoria: "laptops",
    precio: 2399.99,
    imagen: "/img/productos/razer-blade14.webp",
    descripcion: "Laptop gamer compacta premium con chasis de aluminio y RTX 4070.",
    descripcionDetallada: "La Razer Blade 14 ofrece potencia de escritorio en un chasis ultracompacto de aluminio CNC. Con RTX 4070 y AMD Ryzen 9, es de las laptops gamer más codiciadas por su diseño y rendimiento.",
    caracteristicas: [
      "AMD Ryzen 9 8945HS",
      "NVIDIA RTX 4070 8GB",
      "Pantalla 14\" QHD+ 240Hz",
      "32GB RAM DDR5",
      "Chasis de aluminio CNC unibody",
      "Iluminación Razer Chroma RGB"
    ],
    especificaciones: {
      "Procesador": "AMD Ryzen 9 8945HS",
      "GPU": "RTX 4070 8GB",
      "RAM": "32GB DDR5",
      "Almacenamiento": "1TB NVMe SSD",
      "Pantalla": "14\" QHD+ 240Hz"
    },
    stock: 3,
    garantia: "24 meses",
    ofertaNavideña: { activa: false, descuento: 0, precioOriginal: 2399.99, precioOferta: 2399.99, fechaInicio: null, fechaFin: null, etiqueta: null }
  },
  {
    nombre: "Laptop Empresarial Intel Evo ASUS ExpertBook",
    marca: "ASUS",
    categoria: "laptops",
    precio: 999.99,
    imagen: "/img/productos/asus-expertbook.webp",
    descripcion: "Laptop empresarial certificada Intel Evo, ligera y con gran autonomía.",
    descripcionDetallada: "La ASUS ExpertBook B9 está diseñada para profesionales. Certificada Intel Evo para máximo rendimiento y eficiencia, con chasis de fibra de carbono ultraligero de solo 880g.",
    caracteristicas: [
      "Intel Core i7-1355U Evo",
      "Chasis de fibra de carbono",
      "Peso de solo 880g",
      "16GB RAM LPDDR5",
      "SSD NVMe 512GB",
      "Lector de huella y cámara IR"
    ],
    especificaciones: {
      "Procesador": "Intel Core i7-1355U",
      "RAM": "16GB LPDDR5",
      "Almacenamiento": "512GB NVMe SSD",
      "Peso": "880g",
      "Certificación": "Intel Evo"
    },
    stock: 10,
    garantia: "24 meses",
    ofertaNavideña: { activa: false, descuento: 0, precioOriginal: 999.99, precioOferta: 999.99, fechaInicio: null, fechaFin: null, etiqueta: null }
  },
  {
    nombre: "Laptop Kingston FURY Renegade Custom Build",
    marca: "Kingston",
    categoria: "laptops",
    precio: 1599.99,
    imagen: "/img/productos/kingston-fury-laptop.webp",
    descripcion: "Laptop gamer ensamblada con memoria Kingston FURY y SSD de alto rendimiento.",
    descripcionDetallada: "Esta laptop gamer viene optimizada con componentes Kingston FURY: RAM DDR5 de alta velocidad y SSD NVMe Renegade para cargas ultrarrápidas, combinada con Intel Core i7 y RTX 4060.",
    caracteristicas: [
      "Intel Core i7-13700H",
      "NVIDIA RTX 4060 8GB",
      "RAM Kingston FURY 32GB DDR5",
      "SSD Kingston FURY Renegade 1TB",
      "Pantalla 15.6\" 165Hz",
      "Refrigeración dual fan"
    ],
    especificaciones: {
      "Procesador": "Intel Core i7-13700H",
      "GPU": "RTX 4060 8GB",
      "RAM": "32GB DDR5 Kingston FURY",
      "Almacenamiento": "1TB NVMe Kingston FURY Renegade",
      "Pantalla": "15.6\" 165Hz"
    },
    stock: 5,
    garantia: "12 meses",
    ofertaNavideña: { activa: true, descuento: 10, precioOriginal: 1599.99, precioOferta: 1439.99, fechaInicio: "2025-12-01", fechaFin: "2025-12-31", etiqueta: "Oferta" }
  },

  // ───────── CELULARES ─────────
  {
    nombre: "Xiaomi Redmi Note 13 Pro",
    marca: "Xiaomi",
    categoria: "celulares",
    precio: 299.99,
    imagen: "/img/productos/xiaomi-redmi-note13pro.webp",
    descripcion: "Smartphone con cámara de 200MP y carga rápida de 67W.",
    descripcionDetallada: "El Redmi Note 13 Pro destaca por su cámara principal de 200MP con OIS, pantalla AMOLED de 120Hz y carga rápida de 67W que llena la batería en menos de 45 minutos.",
    caracteristicas: [
      "Cámara principal 200MP con OIS",
      "Pantalla AMOLED 120Hz",
      "Carga rápida 67W",
      "Batería de 5100mAh",
      "Snapdragon 7s Gen 2",
      "Certificación IP54"
    ],
    especificaciones: {
      "Pantalla": "6.67\" AMOLED 120Hz",
      "Procesador": "Snapdragon 7s Gen 2",
      "RAM": "8GB",
      "Almacenamiento": "256GB",
      "Batería": "5100mAh"
    },
    stock: 18,
    garantia: "12 meses",
    ofertaNavideña: { activa: true, descuento: 15, precioOriginal: 299.99, precioOferta: 254.99, fechaInicio: "2025-12-01", fechaFin: "2025-12-31", etiqueta: "Black Friday" }
  },
  {
    nombre: "Xiaomi 14T Pro",
    marca: "Xiaomi",
    categoria: "celulares",
    precio: 699.99,
    imagen: "/img/productos/xiaomi-14t-pro.webp",
    descripcion: "Flagship con cámaras Leica y procesador Dimensity 9300+.",
    descripcionDetallada: "El Xiaomi 14T Pro integra óptica Leica de triple cámara, procesador MediaTek Dimensity 9300+ y carga ultrarrápida de 120W para una experiencia premium completa.",
    caracteristicas: [
      "Triple cámara Leica 50MP",
      "MediaTek Dimensity 9300+",
      "Carga HyperCharge 120W",
      "Pantalla AMOLED 144Hz",
      "Batería de 5000mAh",
      "Certificación IP68"
    ],
    especificaciones: {
      "Pantalla": "6.67\" AMOLED 144Hz",
      "Procesador": "Dimensity 9300+",
      "RAM": "12GB",
      "Almacenamiento": "512GB",
      "Batería": "5000mAh"
    },
    stock: 7,
    garantia: "12 meses",
    ofertaNavideña: { activa: false, descuento: 0, precioOriginal: 699.99, precioOferta: 699.99, fechaInicio: null, fechaFin: null, etiqueta: null }
  },
  {
    nombre: "ASUS ROG Phone 8",
    marca: "ASUS",
    categoria: "celulares",
    precio: 999.99,
    imagen: "/img/productos/asus-rog-phone8.webp",
    descripcion: "Smartphone gaming con Snapdragon 8 Gen 3 y disipación de calor avanzada.",
    descripcionDetallada: "El ASUS ROG Phone 8 está diseñado para gaming móvil extremo. Con Snapdragon 8 Gen 3, sistema de refrigeración GameCool 8 y triggers ultrasónicos AirTrigger para control total en juegos.",
    caracteristicas: [
      "Snapdragon 8 Gen 3",
      "Sistema GameCool 8",
      "AirTrigger ultrasónicos",
      "Pantalla AMOLED 165Hz",
      "Batería de 5500mAh",
      "Carga rápida 65W"
    ],
    especificaciones: {
      "Pantalla": "6.78\" AMOLED 165Hz",
      "Procesador": "Snapdragon 8 Gen 3",
      "RAM": "16GB",
      "Almacenamiento": "512GB",
      "Batería": "5500mAh"
    },
    stock: 4,
    garantia: "12 meses",
    ofertaNavideña: { activa: true, descuento: 12, precioOriginal: 999.99, precioOferta: 879.99, fechaInicio: "2025-12-01", fechaFin: "2025-12-31", etiqueta: "Black Friday" }
  },
  {
    nombre: "Teclast Capsule 5",
    marca: "Teclast",
    categoria: "celulares",
    precio: 159.99,
    imagen: "/img/productos/teclast-capsule5.webp",
    descripcion: "Smartphone económico con gran batería y pantalla de 90Hz.",
    descripcionDetallada: "El Teclast Capsule 5 es una opción accesible con buen rendimiento diario. Pantalla de 90Hz, batería de 5000mAh y triple cámara para fotografía básica de calidad.",
    caracteristicas: [
      "Pantalla IPS 90Hz",
      "Batería de 5000mAh",
      "Triple cámara trasera",
      "Procesador Unisoc T616",
      "Carga de 18W",
      "Doble SIM + microSD"
    ],
    especificaciones: {
      "Pantalla": "6.6\" IPS 90Hz",
      "Procesador": "Unisoc T616",
      "RAM": "8GB",
      "Almacenamiento": "128GB",
      "Batería": "5000mAh"
    },
    stock: 22,
    garantia: "6 meses",
    ofertaNavideña: { activa: false, descuento: 0, precioOriginal: 159.99, precioOferta: 159.99, fechaInicio: null, fechaFin: null, etiqueta: null }
  },
  {
    nombre: "Smartphone Gaming MSI Claw Connect",
    marca: "MSI",
    categoria: "celulares",
    precio: 549.99,
    imagen: "/img/productos/msi-claw-connect.webp",
    descripcion: "Smartphone orientado a gaming con controles físicos desmontables.",
    descripcionDetallada: "El MSI Claw Connect integra controles físicos desmontables tipo gamepad, ideal para streaming de juegos en la nube y emulación móvil con gran ergonomía.",
    caracteristicas: [
      "Controles físicos desmontables",
      "Pantalla AMOLED 120Hz",
      "Snapdragon 7 Gen 3",
      "Batería de 5800mAh",
      "Cooling activo integrado",
      "Carga rápida 45W"
    ],
    especificaciones: {
      "Pantalla": "6.7\" AMOLED 120Hz",
      "Procesador": "Snapdragon 7 Gen 3",
      "RAM": "12GB",
      "Almacenamiento": "256GB",
      "Batería": "5800mAh"
    },
    stock: 6,
    garantia: "12 meses",
    ofertaNavideña: { activa: true, descuento: 18, precioOriginal: 549.99, precioOferta: 450.99, fechaInicio: "2025-12-01", fechaFin: "2025-12-31", etiqueta: "Oferta" }
  },
  {
    nombre: "Smartphone Razer Edition Phone 3",
    marca: "Razer",
    categoria: "celulares",
    precio: 799.99,
    imagen: "/img/productos/razer-phone3.webp",
    descripcion: "Smartphone gamer con pantalla 165Hz e iluminación Chroma RGB en el logo.",
    descripcionDetallada: "El Razer Phone 3 trae la experiencia gamer de Razer al bolsillo. Pantalla UltraMotion de 165Hz, altavoces estéreo frontales con Dolby Atmos y el icónico logo Chroma RGB personalizable.",
    caracteristicas: [
      "Pantalla UltraMotion 165Hz",
      "Altavoces estéreo Dolby Atmos",
      "Logo Chroma RGB personalizable",
      "Snapdragon 8 Gen 2",
      "Batería de 5000mAh",
      "Vapor chamber cooling"
    ],
    especificaciones: {
      "Pantalla": "6.8\" AMOLED 165Hz",
      "Procesador": "Snapdragon 8 Gen 2",
      "RAM": "16GB",
      "Almacenamiento": "256GB",
      "Batería": "5000mAh"
    },
    stock: 5,
    garantia: "12 meses",
    ofertaNavideña: { activa: false, descuento: 0, precioOriginal: 799.99, precioOferta: 799.99, fechaInicio: null, fechaFin: null, etiqueta: null }
  },
  {
    nombre: "Xiaomi Poco X6 Pro",
    marca: "Xiaomi",
    categoria: "celulares",
    precio: 349.99,
    imagen: "/img/productos/xiaomi-poco-x6pro.webp",
    descripcion: "Smartphone con Dimensity 8300 Ultra y pantalla AMOLED curva de 120Hz.",
    descripcionDetallada: "El Poco X6 Pro ofrece rendimiento de gama alta a precio medio. Con Dimensity 8300 Ultra, pantalla AMOLED curva de 120Hz y carga ultrarrápida de 67W.",
    caracteristicas: [
      "MediaTek Dimensity 8300 Ultra",
      "Pantalla AMOLED curva 120Hz",
      "Carga HyperCharge 67W",
      "Cámara principal 64MP OIS",
      "Batería de 5000mAh",
      "Certificación IP54"
    ],
    especificaciones: {
      "Pantalla": "6.67\" AMOLED 120Hz",
      "Procesador": "Dimensity 8300 Ultra",
      "RAM": "12GB",
      "Almacenamiento": "256GB",
      "Batería": "5000mAh"
    },
    stock: 14,
    garantia: "12 meses",
    ofertaNavideña: { activa: true, descuento: 20, precioOriginal: 349.99, precioOferta: 279.99, fechaInicio: "2025-12-01", fechaFin: "2025-12-31", etiqueta: "Black Friday" }
  },
  {
    nombre: "ASUS Zenfone 11 Ultra",
    marca: "ASUS",
    categoria: "celulares",
    precio: 899.99,
    imagen: "/img/productos/asus-zenfone11.webp",
    descripcion: "Flagship compacto con Snapdragon 8 Gen 3 y estabilización gimbal de cámara.",
    descripcionDetallada: "El ASUS Zenfone 11 Ultra ofrece especificaciones de gama alta con cámara estabilizada por gimbal de 6 ejes, ideal para video estable sin accesorios adicionales.",
    caracteristicas: [
      "Snapdragon 8 Gen 3",
      "Estabilización gimbal 6 ejes",
      "Pantalla AMOLED 144Hz",
      "Batería de 5500mAh",
      "Carga rápida 65W",
      "Certificación IP68"
    ],
    especificaciones: {
      "Pantalla": "6.78\" AMOLED 144Hz",
      "Procesador": "Snapdragon 8 Gen 3",
      "RAM": "16GB",
      "Almacenamiento": "512GB",
      "Batería": "5500mAh"
    },
    stock: 6,
    garantia: "12 meses",
    ofertaNavideña: { activa: false, descuento: 0, precioOriginal: 899.99, precioOferta: 899.99, fechaInicio: null, fechaFin: null, etiqueta: null }
  },
  {
    nombre: "Smartphone Corsair Tech Edition C1",
    marca: "Corsair",
    categoria: "celulares",
    precio: 459.99,
    imagen: "/img/productos/corsair-c1-phone.webp",
    descripcion: "Smartphone con diseño inspirado en periféricos gamer y RGB en el panel trasero.",
    descripcionDetallada: "El Corsair C1 trae el ADN gamer de la marca a un smartphone. Panel trasero con iluminación RGB iCUE, gran rendimiento multitarea y diseño robusto para gamers en movimiento.",
    caracteristicas: [
      "Panel trasero RGB iCUE",
      "Snapdragon 7+ Gen 3",
      "Pantalla AMOLED 120Hz",
      "Batería de 5200mAh",
      "Carga rápida 50W",
      "Altavoces estéreo duales"
    ],
    especificaciones: {
      "Pantalla": "6.7\" AMOLED 120Hz",
      "Procesador": "Snapdragon 7+ Gen 3",
      "RAM": "12GB",
      "Almacenamiento": "256GB",
      "Batería": "5200mAh"
    },
    stock: 8,
    garantia: "12 meses",
    ofertaNavideña: { activa: true, descuento: 10, precioOriginal: 459.99, precioOferta: 413.99, fechaInicio: "2025-12-01", fechaFin: "2025-12-31", etiqueta: "Oferta" }
  },
  {
    nombre: "Smartphone Logitech G Edition Mobile",
    marca: "Logitech G",
    categoria: "celulares",
    precio: 399.99,
    imagen: "/img/productos/logitech-g-mobile.webp",
    descripcion: "Smartphone orientado a cloud gaming con software G HUB Mobile integrado.",
    descripcionDetallada: "El Logitech G Mobile está optimizado para cloud gaming, con software G HUB Mobile preinstalado para personalizar controles táctiles y conexión rápida a periféricos Logitech G.",
    caracteristicas: [
      "Software G HUB Mobile",
      "Snapdragon 7 Gen 2",
      "Pantalla AMOLED 120Hz",
      "Batería de 5000mAh",
      "Compatible con periféricos Logitech G",
      "Carga rápida 45W"
    ],
    especificaciones: {
      "Pantalla": "6.6\" AMOLED 120Hz",
      "Procesador": "Snapdragon 7 Gen 2",
      "RAM": "8GB",
      "Almacenamiento": "256GB",
      "Batería": "5000mAh"
    },
    stock: 10,
    garantia: "12 meses",
    ofertaNavideña: { activa: false, descuento: 0, precioOriginal: 399.99, precioOferta: 399.99, fechaInicio: null, fechaFin: null, etiqueta: null }
},
  {
    "nombre": "Procesador AMD Ryzen 7 7800X3D",
    "marca": "AMD",
    "categoria": "componentes",
    "precio": 449.99,
    "imagen": "/img/productos/amd-ryzen-7800x3d.webp",
    "descripcion": "Procesador gaming de 8 núcleos con tecnología 3D V-Cache para máximo rendimiento.",
    "descripcionDetallada": "El AMD Ryzen 7 7800X3D es el procesador definitivo para gaming. Con 8 núcleos y 16 hilos, tecnología 3D V-Cache y frecuencia de hasta 5.0GHz, ofrece un rendimiento superior en juegos y aplicaciones exigentes.",
    "caracteristicas": [
      "8 núcleos / 16 hilos",
      "Frecuencia base 4.2GHz / Turbo 5.0GHz",
      "Tecnología 3D V-Cache de 96MB",
      "Socket AM5",
      "Consumo de 120W TDP",
      "Compatible con DDR5"
    ],
    "especificaciones": {
      "Núcleos": "8",
      "Hilos": "16",
      "Frecuencia": "4.2GHz - 5.0GHz",
      "Caché L3": "96MB",
      "Socket": "AM5",
      "TDP": "120W"
    },
    "stock": 12,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 10,
      "precioOriginal": 449.99,
      "precioOferta": 404.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Procesador AMD Ryzen 5 7600X",
    "marca": "AMD",
    "categoria": "componentes",
    "precio": 229.99,
    "imagen": "/img/productos/amd-ryzen-7600x.webp",
    "descripcion": "Procesador de 6 núcleos para gaming y productividad con arquitectura Zen 4.",
    "descripcionDetallada": "El Ryzen 5 7600X ofrece el equilibrio perfecto entre rendimiento y precio. Con 6 núcleos, 12 hilos y frecuencia de hasta 5.3GHz, es ideal para gamers y creadores de contenido que buscan lo mejor de AMD.",
    "caracteristicas": [
      "6 núcleos / 12 hilos",
      "Frecuencia turbo 5.3GHz",
      "Arquitectura Zen 4",
      "Socket AM5",
      "105W TDP",
      "Soporte DDR5 y PCIe 5.0"
    ],
    "especificaciones": {
      "Núcleos": "6",
      "Hilos": "12",
      "Frecuencia": "4.7GHz - 5.3GHz",
      "Caché L3": "32MB",
      "Socket": "AM5",
      "TDP": "105W"
    },
    "stock": 20,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 229.99,
      "precioOferta": 229.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Procesador AMD Ryzen 9 7950X",
    "marca": "AMD",
    "categoria": "componentes",
    "precio": 549.99,
    "imagen": "/img/productos/amd-ryzen-7950x.webp",
    "descripcion": "Procesador de 16 núcleos para estaciones de trabajo y gaming de alta gama.",
    "descripcionDetallada": "El Ryzen 9 7950X es el tope de gama de AMD. Con 16 núcleos y 32 hilos, frecuencia de hasta 5.7GHz, es el procesador más potente para creadores de contenido, renderizado 3D y gaming en 4K sin compromisos.",
    "caracteristicas": [
      "16 núcleos / 32 hilos",
      "Frecuencia turbo 5.7GHz",
      "Arquitectura Zen 4",
      "Socket AM5",
      "170W TDP",
      "Soporte DDR5 y PCIe 5.0"
    ],
    "especificaciones": {
      "Núcleos": "16",
      "Hilos": "32",
      "Frecuencia": "4.5GHz - 5.7GHz",
      "Caché L3": "64MB",
      "Socket": "AM5",
      "TDP": "170W"
    },
    "stock": 8,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 15,
      "precioOriginal": 549.99,
      "precioOferta": 467.49,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Procesador Intel Core i9-13900K",
    "marca": "Intel",
    "categoria": "componentes",
    "precio": 589.99,
    "imagen": "/img/productos/intel-i9-13900k.webp",
    "descripcion": "Procesador de 24 núcleos para máximo rendimiento en gaming y productividad.",
    "descripcionDetallada": "El Intel Core i9-13900K es el procesador insignia de Intel. Con 24 núcleos (8 Performance + 16 Efficient), 32 hilos y frecuencia de hasta 5.8GHz, ofrece un rendimiento increíble para todo tipo de tareas.",
    "caracteristicas": [
      "24 núcleos / 32 hilos",
      "Frecuencia turbo 5.8GHz",
      "Arquitectura híbrida Performance + Efficient",
      "Socket LGA1700",
      "125W TDP (253W PL2)",
      "Compatible con DDR4 y DDR5"
    ],
    "especificaciones": {
      "Núcleos": "24 (8P+16E)",
      "Hilos": "32",
      "Frecuencia": "3.0GHz - 5.8GHz",
      "Caché L3": "36MB",
      "Socket": "LGA1700",
      "TDP": "125W"
    },
    "stock": 6,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 589.99,
      "precioOferta": 589.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Procesador Intel Core i7-13700K",
    "marca": "Intel",
    "categoria": "componentes",
    "precio": 409.99,
    "imagen": "/img/productos/intel-i7-13700k.webp",
    "descripcion": "Procesador de 16 núcleos con rendimiento excepcional para gaming y creación.",
    "descripcionDetallada": "El Intel Core i7-13700K ofrece lo mejor para gamers y creadores. Con 16 núcleos, 24 hilos y frecuencia de hasta 5.4GHz, es la opción ideal para quienes buscan alto rendimiento sin llegar al tope de gama.",
    "caracteristicas": [
      "16 núcleos / 24 hilos",
      "Frecuencia turbo 5.4GHz",
      "Arquitectura híbrida",
      "Socket LGA1700",
      "125W TDP",
      "Soporte DDR4 y DDR5"
    ],
    "especificaciones": {
      "Núcleos": "16 (8P+8E)",
      "Hilos": "24",
      "Frecuencia": "3.4GHz - 5.4GHz",
      "Caché L3": "30MB",
      "Socket": "LGA1700",
      "TDP": "125W"
    },
    "stock": 10,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 12,
      "precioOriginal": 409.99,
      "precioOferta": 360.79,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Procesador Intel Core i5-13600K",
    "marca": "Intel",
    "categoria": "componentes",
    "precio": 319.99,
    "imagen": "/img/productos/intel-i5-13600k.webp",
    "descripcion": "Procesador de 14 núcleos ideal para gaming de alto rendimiento.",
    "descripcionDetallada": "El Intel Core i5-13600K es el procesador más popular para gaming. Con 14 núcleos y 20 hilos, ofrece una relación rendimiento-precio increíble para gamers y creadores de contenido.",
    "caracteristicas": [
      "14 núcleos / 20 hilos",
      "Frecuencia turbo 5.1GHz",
      "Arquitectura híbrida",
      "Socket LGA1700",
      "125W TDP",
      "Soporte DDR4 y DDR5"
    ],
    "especificaciones": {
      "Núcleos": "14 (6P+8E)",
      "Hilos": "20",
      "Frecuencia": "3.5GHz - 5.1GHz",
      "Caché L3": "24MB",
      "Socket": "LGA1700",
      "TDP": "125W"
    },
    "stock": 15,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 319.99,
      "precioOferta": 319.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Memoria RAM Kingston Fury Beast DDR5 32GB (2x16GB) 6000MHz",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 189.99,
    "imagen": "/img/productos/kingston-fury-beast-ddr5.webp",
    "descripcion": "Kit de 32GB DDR5 a 6000MHz con disipadores RGB para máximo rendimiento.",
    "descripcionDetallada": "La memoria Kingston Fury Beast DDR5 ofrece la mejor velocidad y rendimiento para plataformas AMD e Intel. Con 6000MHz, latencia CL36 y disipadores RGB, es la elección perfecta para gaming y overclocking.",
    "caracteristicas": [
      "Capacidad 32GB (2x16GB)",
      "Frecuencia 6000MHz (PC5-48000)",
      "Latencia CL36-38-38",
      "Disipadores con iluminación RGB",
      "Voltaje 1.35V",
      "Compatible con XMP 3.0 y EXPO"
    ],
    "especificaciones": {
      "Capacidad": "32GB (2x16GB)",
      "Frecuencia": "6000MHz",
      "Latencia": "CL36-38-38",
      "Voltaje": "1.35V",
      "Formato": "DIMM 288-pin",
      "Tipo": "DDR5"
    },
    "stock": 18,
    "garantia": "60 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 20,
      "precioOriginal": 189.99,
      "precioOferta": 151.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Memoria RAM Kingston Fury Beast DDR4 32GB (2x16GB) 3200MHz",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 109.99,
    "imagen": "/img/productos/kingston-fury-beast-ddr4.webp",
    "descripcion": "Kit de 32GB DDR4 a 3200MHz con disipadores negros estilo militar.",
    "descripcionDetallada": "La memoria Kingston Fury Beast DDR4 ofrece un rendimiento excepcional para plataformas anteriores. Con 3200MHz y latencia CL16, es ideal para gamers y creadores que aún usan DDR4.",
    "caracteristicas": [
      "Capacidad 32GB (2x16GB)",
      "Frecuencia 3200MHz",
      "Latencia CL16-18-18",
      "Disipadores de aluminio negro",
      "Voltaje 1.35V",
      "Compatible con XMP 2.0"
    ],
    "especificaciones": {
      "Capacidad": "32GB (2x16GB)",
      "Frecuencia": "3200MHz",
      "Latencia": "CL16-18-18",
      "Voltaje": "1.35V",
      "Formato": "DIMM 288-pin",
      "Tipo": "DDR4"
    },
    "stock": 22,
    "garantia": "60 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 109.99,
      "precioOferta": 109.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Memoria RAM Kingston FURY Renegade DDR5 64GB (2x32GB) 6000MHz",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 329.99,
    "imagen": "/img/productos/kingston-fury-renegade-ddr5.webp",
    "descripcion": "Kit de 64GB DDR5 para estaciones de trabajo y gaming de máxima exigencia.",
    "descripcionDetallada": "La Kingston FURY Renegade DDR5 es la memoria definitiva para creadores y gamers. Con 64GB de capacidad, 6000MHz y latencia CL32, ofrece el máximo rendimiento para edición de video, renderizado 3D y juegos pesados.",
    "caracteristicas": [
      "Capacidad 64GB (2x32GB)",
      "Frecuencia 6000MHz",
      "Latencia CL32-38-38",
      "Disipadores negros de aluminio",
      "Voltaje 1.35V",
      "Compatible con XMP 3.0"
    ],
    "especificaciones": {
      "Capacidad": "64GB (2x32GB)",
      "Frecuencia": "6000MHz",
      "Latencia": "CL32-38-38",
      "Voltaje": "1.35V",
      "Formato": "DIMM 288-pin",
      "Tipo": "DDR5"
    },
    "stock": 5,
    "garantia": "60 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 10,
      "precioOriginal": 329.99,
      "precioOferta": 296.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Oferta"
    }
  },
  {
    "nombre": "SSD Kingston NV2 1TB NVMe PCIe 4.0",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 79.99,
    "imagen": "/img/productos/kingston-nv2-1tb.webp",
    "descripcion": "SSD M.2 NVMe de 1TB con velocidades de lectura de hasta 3500MB/s.",
    "descripcionDetallada": "El Kingston NV2 es el SSD perfecto para actualizar tu PC. Con 1TB de capacidad, interfaz PCIe 4.0 y velocidades de lectura de 3500MB/s, ofrece un rendimiento excepcional para juegos y aplicaciones.",
    "caracteristicas": [
      "Capacidad 1TB",
      "Interfaz PCIe 4.0",
      "Velocidad lectura 3500MB/s",
      "Velocidad escritura 2100MB/s",
      "Formato M.2 2280",
      "Bajo consumo energético"
    ],
    "especificaciones": {
      "Capacidad": "1TB",
      "Interfaz": "PCIe 4.0 x4",
      "Lectura": "3500MB/s",
      "Escritura": "2100MB/s",
      "Formato": "M.2 2280",
      "TBW": "320TB"
    },
    "stock": 30,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 15,
      "precioOriginal": 79.99,
      "precioOferta": 67.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "SSD Kingston NV2 2TB NVMe PCIe 4.0",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 139.99,
    "imagen": "/img/productos/kingston-nv2-2tb.webp",
    "descripcion": "SSD M.2 NVMe de 2TB con almacenamiento masivo y altas velocidades.",
    "descripcionDetallada": "El Kingston NV2 de 2TB ofrece el equilibrio perfecto entre capacidad y rendimiento. Con PCIe 4.0 y velocidades de lectura de 3500MB/s, es ideal para gamers que necesitan espacio para su biblioteca de juegos.",
    "caracteristicas": [
      "Capacidad 2TB",
      "Interfaz PCIe 4.0",
      "Velocidad lectura 3500MB/s",
      "Velocidad escritura 2800MB/s",
      "Formato M.2 2280",
      "Bajo consumo energético"
    ],
    "especificaciones": {
      "Capacidad": "2TB",
      "Interfaz": "PCIe 4.0 x4",
      "Lectura": "3500MB/s",
      "Escritura": "2800MB/s",
      "Formato": "M.2 2280",
      "TBW": "640TB"
    },
    "stock": 20,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 139.99,
      "precioOferta": 139.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "SSD Kingston KC3000 1TB PCIe 4.0 NVMe",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 119.99,
    "imagen": "/img/productos/kingston-kc3000-1tb.webp",
    "descripcion": "SSD de alto rendimiento con velocidades de lectura de hasta 7000MB/s.",
    "descripcionDetallada": "El Kingston KC3000 es el SSD más rápido de la marca. Con 1TB de capacidad, PCIe 4.0 y velocidades de lectura de 7000MB/s, es perfecto para gamers y creadores que exigen lo mejor en rendimiento.",
    "caracteristicas": [
      "Capacidad 1TB",
      "Interfaz PCIe 4.0",
      "Velocidad lectura 7000MB/s",
      "Velocidad escritura 6000MB/s",
      "Formato M.2 2280",
      "Disipador de grafeno incluido"
    ],
    "especificaciones": {
      "Capacidad": "1TB",
      "Interfaz": "PCIe 4.0 x4",
      "Lectura": "7000MB/s",
      "Escritura": "6000MB/s",
      "Formato": "M.2 2280",
      "TBW": "800TB"
    },
    "stock": 12,
    "garantia": "60 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 20,
      "precioOriginal": 119.99,
      "precioOferta": 95.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "SSD Kingston A400 480GB SATA III",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 44.99,
    "imagen": "/img/productos/kingston-a400-480gb.webp",
    "descripcion": "SSD SATA de 480GB para actualizar PCs antiguos con bajo presupuesto.",
    "descripcionDetallada": "El Kingston A400 es la solución económica para dar nueva vida a tu PC. Con 480GB de capacidad y velocidades SATA III, es perfecto para mejorar el rendimiento de equipos más antiguos.",
    "caracteristicas": [
      "Capacidad 480GB",
      "Interfaz SATA III 6Gbps",
      "Velocidad lectura 500MB/s",
      "Velocidad escritura 450MB/s",
      "Formato 2.5 pulgadas",
      "Bajo consumo energético"
    ],
    "especificaciones": {
      "Capacidad": "480GB",
      "Interfaz": "SATA III",
      "Lectura": "500MB/s",
      "Escritura": "450MB/s",
      "Formato": "2.5 pulgadas",
      "TBW": "160TB"
    },
    "stock": 40,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 44.99,
      "precioOferta": 44.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "SSD Kingston A400 960GB SATA III",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 69.99,
    "imagen": "/img/productos/kingston-a400-960gb.webp",
    "descripcion": "SSD SATA de 960GB con gran capacidad y excelente relación precio-rendimiento.",
    "descripcionDetallada": "El Kingston A400 de 960GB ofrece el equilibrio perfecto entre capacidad y precio. Ideal para quienes necesitan mucho espacio sin gastar mucho, manteniendo velocidades SATA III de alto rendimiento.",
    "caracteristicas": [
      "Capacidad 960GB",
      "Interfaz SATA III 6Gbps",
      "Velocidad lectura 500MB/s",
      "Velocidad escritura 450MB/s",
      "Formato 2.5 pulgadas",
      "Bajo consumo energético"
    ],
    "especificaciones": {
      "Capacidad": "960GB",
      "Interfaz": "SATA III",
      "Lectura": "500MB/s",
      "Escritura": "450MB/s",
      "Formato": "2.5 pulgadas",
      "TBW": "320TB"
    },
    "stock": 35,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 10,
      "precioOriginal": 69.99,
      "precioOferta": 62.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Oferta"
    }
  },
  {
    "nombre": "SSD Kingston NV3 1TB Gen4 NVMe",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 89.99,
    "imagen": "/img/productos/kingston-nv3-1tb.webp",
    "descripcion": "SSD NVMe de nueva generación con velocidades de lectura de hasta 6000MB/s.",
    "descripcionDetallada": "El Kingston NV3 es la evolución del popular NV2. Con 1TB de capacidad y velocidades de lectura de 6000MB/s, ofrece un rendimiento superior para gamers y usuarios exigentes.",
    "caracteristicas": [
      "Capacidad 1TB",
      "Interfaz PCIe 4.0",
      "Velocidad lectura 6000MB/s",
      "Velocidad escritura 4000MB/s",
      "Formato M.2 2280",
      "Eficiencia energética mejorada"
    ],
    "especificaciones": {
      "Capacidad": "1TB",
      "Interfaz": "PCIe 4.0 x4",
      "Lectura": "6000MB/s",
      "Escritura": "4000MB/s",
      "Formato": "M.2 2280",
      "TBW": "400TB"
    },
    "stock": 15,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 89.99,
      "precioOferta": 89.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "SSD Kingston NV3 2TB Gen4 NVMe",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 149.99,
    "imagen": "/img/productos/kingston-nv3-2tb.webp",
    "descripcion": "SSD de 2TB con velocidades ultrarrápidas para almacenamiento masivo.",
    "descripcionDetallada": "El Kingston NV3 de 2TB es ideal para gamers con bibliotecas extensas. Con 2TB de capacidad y velocidades de lectura de 6000MB/s, tendrás espacio y rendimiento para todos tus juegos y aplicaciones.",
    "caracteristicas": [
      "Capacidad 2TB",
      "Interfaz PCIe 4.0",
      "Velocidad lectura 6000MB/s",
      "Velocidad escritura 5000MB/s",
      "Formato M.2 2280",
      "Eficiencia energética mejorada"
    ],
    "especificaciones": {
      "Capacidad": "2TB",
      "Interfaz": "PCIe 4.0 x4",
      "Lectura": "6000MB/s",
      "Escritura": "5000MB/s",
      "Formato": "M.2 2280",
      "TBW": "800TB"
    },
    "stock": 10,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 15,
      "precioOriginal": 149.99,
      "precioOferta": 127.49,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "SSD Kingston XS1000 1TB Portable SSD",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 99.99,
    "imagen": "/img/productos/kingston-xs1000-1tb.webp",
    "descripcion": "SSD portátil de 1TB con USB 3.2 y velocidades de hasta 1050MB/s.",
    "descripcionDetallada": "El Kingston XS1000 es el SSD portátil perfecto para llevar tus datos. Con 1TB de capacidad, USB 3.2 y velocidades de 1050MB/s, es ideal para transferencias rápidas y almacenamiento externo.",
    "caracteristicas": [
      "Capacidad 1TB",
      "Interfaz USB 3.2 Gen 2",
      "Velocidad lectura 1050MB/s",
      "Velocidad escritura 1000MB/s",
      "Diseño compacto y ligero",
      "Incluye cable USB-C a USB-C"
    ],
    "especificaciones": {
      "Capacidad": "1TB",
      "Interfaz": "USB 3.2 Gen 2",
      "Lectura": "1050MB/s",
      "Escritura": "1000MB/s",
      "Dimensiones": "69.5 x 32.8 x 11.3mm",
      "Peso": "28.7g"
    },
    "stock": 18,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 99.99,
      "precioOferta": 99.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Memoria RAM Kingston FURY Beast DDR5 16GB (2x8GB) 5600MHz",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 89.99,
    "imagen": "/img/productos/kingston-fury-beast-ddr5-16gb.webp",
    "descripcion": "Kit de 16GB DDR5 a 5600MHz para gaming de alta velocidad.",
    "descripcionDetallada": "La Kingston FURY Beast DDR5 de 16GB (2x8GB) ofrece el rendimiento ideal para gamers. Con 5600MHz y latencia CL40, es perfecta para PCs gaming con procesadores de última generación.",
    "caracteristicas": [
      "Capacidad 16GB (2x8GB)",
      "Frecuencia 5600MHz",
      "Latencia CL40-40-40",
      "Disipadores negros de aluminio",
      "Voltaje 1.25V",
      "Compatible con XMP 3.0 y EXPO"
    ],
    "especificaciones": {
      "Capacidad": "16GB (2x8GB)",
      "Frecuencia": "5600MHz",
      "Latencia": "CL40-40-40",
      "Voltaje": "1.25V",
      "Formato": "DIMM 288-pin",
      "Tipo": "DDR5"
    },
    "stock": 25,
    "garantia": "60 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 10,
      "precioOriginal": 89.99,
      "precioOferta": 80.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Oferta"
    }
  },
  {
    "nombre": "Memoria RAM Kingston FURY Impact DDR5 32GB (2x16GB) 5600MHz",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 149.99,
    "imagen": "/img/productos/kingston-fury-impact-ddr5.webp",
    "descripcion": "Memoria SODIMM DDR5 de 32GB para laptops y mini PCs de alto rendimiento.",
    "descripcionDetallada": "La Kingston FURY Impact DDR5 es la memoria perfecta para laptops gaming. Con 32GB de capacidad, 5600MHz y formato SODIMM, es ideal para portátiles de última generación que exigen el máximo rendimiento.",
    "caracteristicas": [
      "Capacidad 32GB (2x16GB)",
      "Frecuencia 5600MHz (PC5-44800)",
      "Latencia CL40-40-40",
      "Formato SODIMM",
      "Voltaje 1.1V",
      "Compatible con Intel y AMD"
    ],
    "especificaciones": {
      "Capacidad": "32GB (2x16GB)",
      "Frecuencia": "5600MHz",
      "Latencia": "CL40-40-40",
      "Voltaje": "1.1V",
      "Formato": "SODIMM 262-pin",
      "Tipo": "DDR5"
    },
    "stock": 8,
    "garantia": "60 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 149.99,
      "precioOferta": 149.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Procesador AMD Ryzen 5 5600X",
    "marca": "AMD",
    "categoria": "componentes",
    "precio": 159.99,
    "imagen": "/img/productos/amd-ryzen-5600x.webp",
    "descripcion": "Procesador de 6 núcleos con tecnología Zen 3 para gaming de alto rendimiento.",
    "descripcionDetallada": "El AMD Ryzen 5 5600X sigue siendo una de las mejores opciones para gaming. Con 6 núcleos, 12 hilos y frecuencia de hasta 4.6GHz, ofrece un rendimiento excelente a un precio muy competitivo.",
    "caracteristicas": [
      "6 núcleos / 12 hilos",
      "Frecuencia base 3.7GHz / Turbo 4.6GHz",
      "Arquitectura Zen 3",
      "Socket AM4",
      "65W TDP",
      "Compatible con PCIe 4.0"
    ],
    "especificaciones": {
      "Núcleos": "6",
      "Hilos": "12",
      "Frecuencia": "3.7GHz - 4.6GHz",
      "Caché L3": "32MB",
      "Socket": "AM4",
      "TDP": "65W"
    },
    "stock": 25,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 20,
      "precioOriginal": 159.99,
      "precioOferta": 127.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Procesador Intel Core i3-13100F",
    "marca": "Intel",
    "categoria": "componentes",
    "precio": 109.99,
    "imagen": "/img/productos/intel-i3-13100f.webp",
    "descripcion": "Procesador de 4 núcleos económico para PCs de entrada y oficina.",
    "descripcionDetallada": "El Intel Core i3-13100F es la opción perfecta para PCs económicas. Con 4 núcleos y 8 hilos, frecuencia de hasta 4.5GHz, ofrece un rendimiento sólido para tareas diarias y gaming ligero.",
    "caracteristicas": [
      "4 núcleos / 8 hilos",
      "Frecuencia turbo 4.5GHz",
      "Arquitectura Raptor Lake",
      "Socket LGA1700",
      "60W TDP",
      "Sin gráficos integrados (F)"
    ],
    "especificaciones": {
      "Núcleos": "4",
      "Hilos": "8",
      "Frecuencia": "3.4GHz - 4.5GHz",
      "Caché L3": "12MB",
      "Socket": "LGA1700",
      "TDP": "60W"
    },
    "stock": 30,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 109.99,
      "precioOferta": 109.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Procesador Intel Core i5-12400F",
    "marca": "Intel",
    "categoria": "componentes",
    "precio": 149.99,
    "imagen": "/img/productos/intel-i5-12400f.webp",
    "descripcion": "Procesador de 6 núcleos con excelente rendimiento para gaming y productividad.",
    "descripcionDetallada": "El Intel Core i5-12400F es el procesador más popular para gaming económico. Con 6 núcleos, 12 hilos y frecuencia de hasta 4.4GHz, ofrece un rendimiento excelente para juegos y tareas diarias.",
    "caracteristicas": [
      "6 núcleos / 12 hilos",
      "Frecuencia turbo 4.4GHz",
      "Arquitectura Alder Lake",
      "Socket LGA1700",
      "65W TDP",
      "Sin gráficos integrados (F)"
    ],
    "especificaciones": {
      "Núcleos": "6",
      "Hilos": "12",
      "Frecuencia": "2.5GHz - 4.4GHz",
      "Caché L3": "18MB",
      "Socket": "LGA1700",
      "TDP": "65W"
    },
    "stock": 20,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 15,
      "precioOriginal": 149.99,
      "precioOferta": 127.49,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Procesador AMD Ryzen 9 7900X",
    "marca": "AMD",
    "categoria": "componentes",
    "precio": 419.99,
    "imagen": "/img/productos/amd-ryzen-7900x.webp",
    "descripcion": "Procesador de 12 núcleos para creadores y gamers de alto rendimiento.",
    "descripcionDetallada": "El AMD Ryzen 9 7900X ofrece 12 núcleos y 24 hilos con arquitectura Zen 4. Con frecuencia de hasta 5.6GHz, es ideal para renderizado, edición de video y gaming en 4K.",
    "caracteristicas": [
      "12 núcleos / 24 hilos",
      "Frecuencia turbo 5.6GHz",
      "Arquitectura Zen 4",
      "Socket AM5",
      "170W TDP",
      "Soporte DDR5 y PCIe 5.0"
    ],
    "especificaciones": {
      "Núcleos": "12",
      "Hilos": "24",
      "Frecuencia": "4.7GHz - 5.6GHz",
      "Caché L3": "64MB",
      "Socket": "AM5",
      "TDP": "170W"
    },
    "stock": 7,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 419.99,
      "precioOferta": 419.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Procesador Intel Core i7-12700K",
    "marca": "Intel",
    "categoria": "componentes",
    "precio": 349.99,
    "imagen": "/img/productos/intel-i7-12700k.webp",
    "descripcion": "Procesador de 12 núcleos con arquitectura híbrida para máximo rendimiento.",
    "descripcionDetallada": "El Intel Core i7-12700K combina 8 núcleos Performance y 4 núcleos Efficient para un rendimiento excelente en gaming y multitarea. Con frecuencia de hasta 5.0GHz, es una opción muy equilibrada.",
    "caracteristicas": [
      "12 núcleos / 20 hilos",
      "Frecuencia turbo 5.0GHz",
      "Arquitectura híbrida (8P+4E)",
      "Socket LGA1700",
      "125W TDP",
      "Soporte DDR4 y DDR5"
    ],
    "especificaciones": {
      "Núcleos": "12 (8P+4E)",
      "Hilos": "20",
      "Frecuencia": "3.6GHz - 5.0GHz",
      "Caché L3": "25MB",
      "Socket": "LGA1700",
      "TDP": "125W"
    },
    "stock": 10,
    "garantia": "36 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 20,
      "precioOriginal": 349.99,
      "precioOferta": 279.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Memoria RAM Kingston FURY Beast RGB DDR4 32GB (2x16GB) 3600MHz",
    "marca": "Kingston",
    "categoria": "componentes",
    "precio": 129.99,
    "imagen": "/img/productos/kingston-fury-beast-rgb-ddr4.webp",
    "descripcion": "Kit de 32GB DDR4 a 3600MHz con iluminación RGB personalizable.",
    "descripcionDetallada": "La Kingston FURY Beast RGB DDR4 combina alto rendimiento con estilo. Con 32GB de capacidad, 3600MHz y latencia CL17, ofrece el máximo rendimiento para gaming con iluminación RGB sincronizable.",
    "caracteristicas": [
      "Capacidad 32GB (2x16GB)",
      "Frecuencia 3600MHz",
      "Latencia CL17-19-19",
      "Iluminación RGB personalizable",
      "Voltaje 1.35V",
      "Compatible con XMP 2.0"
    ],
    "especificaciones": {
      "Capacidad": "32GB (2x16GB)",
      "Frecuencia": "3600MHz",
      "Latencia": "CL17-19-19",
      "Voltaje": "1.35V",
      "Formato": "DIMM 288-pin",
      "Tipo": "DDR4"
    },
    "stock": 12,
    "garantia": "60 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 10,
      "precioOriginal": 129.99,
      "precioOferta": 116.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Oferta"
    }
  },
  {
    "nombre": "Teclado Mecánico HyperX Alloy Origins Core",
    "marca": "HyperX",
    "categoria": "gaming",
    "precio": 89.99,
    "imagen": "/img/productos/hyperx-alloy-origins-core.webp",
    "descripcion": "Teclado mecánico compacto con switches HyperX Red y retroiluminación RGB.",
    "descripcionDetallada": "El HyperX Alloy Origins Core es el teclado mecánico definitivo para gamers. Con switches HyperX Red de respuesta rápida, iluminación RGB por tecla y diseño compacto sin teclado numérico, es perfecto para gaming competitivo.",
    "caracteristicas": [
      "Switches HyperX Red (lineales)",
      "Retroiluminación RGB por tecla",
      "Diseño compacto sin numpad",
      "Cuerpo de aluminio resistente",
      "Cable USB-C desmontable",
      "Software NGENUITY para personalización"
    ],
    "especificaciones": {
      "Switches": "HyperX Red",
      "Retroiluminación": "RGB por tecla",
      "Diseño": "Compacto (sin numpad)",
      "Conexión": "USB-C cableado",
      "Material": "Aluminio",
      "Peso": "800g"
    },
    "stock": 15,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 15,
      "precioOriginal": 89.99,
      "precioOferta": 76.49,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Teclado Mecánico HyperX Alloy Elite 2",
    "marca": "HyperX",
    "categoria": "gaming",
    "precio": 119.99,
    "imagen": "/img/productos/hyperx-alloy-elite-2.webp",
    "descripcion": "Teclado mecánico con switches HyperX Red y reposamuñecas magnético.",
    "descripcionDetallada": "El HyperX Alloy Elite 2 es el teclado gaming premium de HyperX. Con switches HyperX Red, iluminación RGB brillante, controles multimedia dedicados y reposamuñecas magnético, ofrece la mejor experiencia para gamers exigentes.",
    "caracteristicas": [
      "Switches HyperX Red",
      "Iluminación RGB con efectos avanzados",
      "Controles multimedia dedicados",
      "Reposamuñecas magnético incluido",
      "Cuerpo de acero resistente",
      "Software NGENUITY para personalización"
    ],
    "especificaciones": {
      "Switches": "HyperX Red",
      "Retroiluminación": "RGB avanzado",
      "Controles": "Multimedia dedicados",
      "Conexión": "USB cableado",
      "Material": "Acero + plástico",
      "Peso": "1.2kg"
    },
    "stock": 10,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 119.99,
      "precioOferta": 119.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Mouse Gaming Logitech G Pro X Superlight",
    "marca": "Logitech G",
    "categoria": "gaming",
    "precio": 149.99,
    "imagen": "/img/productos/logitech-g-pro-x-superlight.webp",
    "descripcion": "Mouse inalámbrico ultraligero de 63g con sensor HERO 25K para eSports.",
    "descripcionDetallada": "El Logitech G Pro X Superlight es el mouse preferido por profesionales de eSports. Con solo 63g de peso, sensor HERO 25K y conectividad inalámbrica Lightspeed, ofrece una precisión y velocidad incomparables.",
    "caracteristicas": [
      "Peso ultraligero de 63g",
      "Sensor HERO 25K de alta precisión",
      "Conectividad inalámbrica Lightspeed",
      "Batería de 70 horas",
      "5 botones programables",
      "Diseño simétrico para diestros y zurdos"
    ],
    "especificaciones": {
      "Peso": "63g",
      "Sensor": "HERO 25K",
      "DPI": "100 - 25600",
      "Batería": "70 horas",
      "Conectividad": "Lightspeed 2.4GHz",
      "Botones": "5 programables"
    },
    "stock": 12,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 20,
      "precioOriginal": 149.99,
      "precioOferta": 119.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Mouse Gaming Logitech G502 X Plus",
    "marca": "Logitech G",
    "categoria": "gaming",
    "precio": 159.99,
    "imagen": "/img/productos/logitech-g502-x-plus.webp",
    "descripcion": "Mouse gaming inalámbrico con sensor HERO 25K y iluminación RGB LIGHTSYNC.",
    "descripcionDetallada": "El Logitech G502 X Plus es la evolución del legendario G502. Con sensor HERO 25K, 13 botones programables, iluminación RGB LIGHTSYNC y peso ajustable, ofrece el máximo control para gamers competitivos.",
    "caracteristicas": [
      "Sensor HERO 25K",
      "13 botones programables",
      "Iluminación RGB LIGHTSYNC",
      "Pesas ajustables",
      "Conectividad inalámbrica Lightspeed",
      "Batería de 120 horas"
    ],
    "especificaciones": {
      "Sensor": "HERO 25K",
      "DPI": "100 - 25600",
      "Botones": "13 programables",
      "Batería": "120 horas",
      "Conectividad": "Lightspeed + Bluetooth",
      "Peso": "106g (sin pesas)"
    },
    "stock": 8,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 159.99,
      "precioOferta": 159.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Auriculares Gaming HyperX Cloud III",
    "marca": "HyperX",
    "categoria": "gaming",
    "precio": 99.99,
    "imagen": "/img/productos/hyperx-cloud-iii.webp",
    "descripcion": "Auriculares gaming con drivers de 53mm y sonido DTS Headphone:X para inmersión total.",
    "descripcionDetallada": "Los HyperX Cloud III son la tercera generación de los auriculares gaming más populares del mundo. Con drivers de 53mm, sonido DTS Headphone:X y almohadillas de espuma viscoelástica, ofrecen comodidad y calidad de audio excepcionales.",
    "caracteristicas": [
      "Drivers de 53mm de neodimio",
      "Sonido DTS Headphone:X",
      "Almohadillas de espuma viscoelástica",
      "Micrófono desmontable con cancelación de ruido",
      "Cable trenzado de 3m",
      "Compatible con PC, PS5, Xbox y Switch"
    ],
    "especificaciones": {
      "Drivers": "53mm",
      "Sonido": "DTS Headphone:X",
      "Conexión": "USB-A + Jack 3.5mm",
      "Micrófono": "Desmontable con cancelación",
      "Frecuencia": "10Hz - 21000Hz",
      "Peso": "295g"
    },
    "stock": 18,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 15,
      "precioOriginal": 99.99,
      "precioOferta": 84.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Auriculares Gaming HyperX Cloud Stinger 2",
    "marca": "HyperX",
    "categoria": "gaming",
    "precio": 49.99,
    "imagen": "/img/productos/hyperx-cloud-stinger-2.webp",
    "descripcion": "Auriculares gaming económicos con sonido envolvente 7.1 y ligero diseño.",
    "descripcionDetallada": "Los HyperX Cloud Stinger 2 son la opción económica ideal para gamers. Con drivers de 50mm, sonido envolvente 7.1 virtual y diseño ligero de 275g, ofrecen una excelente relación calidad-precio.",
    "caracteristicas": [
      "Drivers de 50mm",
      "Sonido envolvente 7.1 virtual",
      "Diseño ligero de 275g",
      "Almohadillas de espuma suave",
      "Micrófono giratorio con cancelación de ruido",
      "Compatible con PC, PS5 y Xbox"
    ],
    "especificaciones": {
      "Drivers": "50mm",
      "Sonido": "7.1 virtual",
      "Conexión": "Jack 3.5mm",
      "Micrófono": "Giratorio con cancelación",
      "Frecuencia": "10Hz - 20000Hz",
      "Peso": "275g"
    },
    "stock": 25,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 49.99,
      "precioOferta": 49.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Mouse Gaming Logitech G305 Lightspeed",
    "marca": "Logitech G",
    "categoria": "gaming",
    "precio": 59.99,
    "imagen": "/img/productos/logitech-g305-lightspeed.webp",
    "descripcion": "Mouse inalámbrico económico con sensor HERO 12K y batería de 250 horas.",
    "descripcionDetallada": "El Logitech G305 Lightspeed ofrece lo mejor de Logitech a un precio accesible. Con sensor HERO 12K, conectividad inalámbrica Lightspeed y batería de 250 horas con una sola pila AA, es ideal para gamers con presupuesto limitado.",
    "caracteristicas": [
      "Sensor HERO 12K",
      "Conectividad inalámbrica Lightspeed",
      "250 horas de batería con 1 pila AA",
      "6 botones programables",
      "Diseño ligero de 99g",
      "Compatible con PC y Mac"
    ],
    "especificaciones": {
      "Sensor": "HERO 12K",
      "DPI": "100 - 12000",
      "Batería": "250 horas",
      "Conectividad": "Lightspeed 2.4GHz",
      "Botones": "6 programables",
      "Peso": "99g (con pila)"
    },
    "stock": 30,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 10,
      "precioOriginal": 59.99,
      "precioOferta": 53.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Oferta"
    }
  },
  {
    "nombre": "Mouse Gaming Logitech G403 Hero",
    "marca": "Logitech G",
    "categoria": "gaming",
    "precio": 79.99,
    "imagen": "/img/productos/logitech-g403-hero.webp",
    "descripcion": "Mouse gaming ergonómico con sensor HERO 25K y diseño para diestros.",
    "descripcionDetallada": "El Logitech G403 Hero es el mouse perfecto para gamers que buscan comodidad y precisión. Con sensor HERO 25K, diseño ergonómico para diestros y 6 botones programables, es ideal para largas sesiones de juego.",
    "caracteristicas": [
      "Sensor HERO 25K",
      "Diseño ergonómico para diestros",
      "6 botones programables",
      "Iluminación RGB LIGHTSYNC",
      "Conexión USB cableada",
      "Pesas ajustables"
    ],
    "especificaciones": {
      "Sensor": "HERO 25K",
      "DPI": "100 - 25600",
      "Botones": "6 programables",
      "Conexión": "USB cableado",
      "Peso": "92g",
      "Iluminación": "RGB LIGHTSYNC"
    },
    "stock": 15,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 79.99,
      "precioOferta": 79.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Teclado Mecánico Logitech G915 TKL",
    "marca": "Logitech G",
    "categoria": "gaming",
    "precio": 229.99,
    "imagen": "/img/productos/logitech-g915-tkl.webp",
    "descripcion": "Teclado mecánico inalámbrico ultradelgado con switches GL y RGB LIGHTSYNC.",
    "descripcionDetallada": "El Logitech G915 TKL es el teclado gaming premium definitivo. Con diseño ultradelgado, switches GL mecánicos, conectividad inalámbrica Lightspeed y Bluetooth, y RGB LIGHTSYNC, ofrece lo mejor en rendimiento y estilo.",
    "caracteristicas": [
      "Diseño ultradelgado de 23mm",
      "Switches GL mecánicos (Red/Blue/Brown)",
      "Conectividad Lightspeed + Bluetooth",
      "Iluminación RGB LIGHTSYNC",
      "Batería de 40 horas",
      "Diseño TKL sin teclado numérico"
    ],
    "especificaciones": {
      "Switches": "GL Red (lineales)",
      "Conectividad": "Lightspeed + Bluetooth",
      "Batería": "40 horas",
      "Diseño": "TKL ultradelgado",
      "Iluminación": "RGB LIGHTSYNC",
      "Peso": "820g"
    },
    "stock": 6,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 15,
      "precioOriginal": 229.99,
      "precioOferta": 195.49,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Teclado Mecánico Logitech G Pro X",
    "marca": "Logitech G",
    "categoria": "gaming",
    "precio": 149.99,
    "imagen": "/img/productos/logitech-g-pro-x.webp",
    "descripcion": "Teclado mecánico compacto diseñado para eSports con switches intercambiables.",
    "descripcionDetallada": "El Logitech G Pro X es el teclado preferido por los profesionales de eSports. Con diseño compacto TKL, switches intercambiables en caliente, cable desmontable y RGB LIGHTSYNC, ofrece personalización total para gamers competitivos.",
    "caracteristicas": [
      "Diseño compacto TKL",
      "Switches intercambiables en caliente",
      "Cable USB-C desmontable",
      "Iluminación RGB LIGHTSYNC",
      "Cuerpo de aluminio resistente",
      "Teclas PBT duraderas"
    ],
    "especificaciones": {
      "Diseño": "TKL compacto",
      "Switches": "Intercambiables (GX Red/Blue/Brown)",
      "Conectividad": "USB-C cableado",
      "Iluminación": "RGB LIGHTSYNC",
      "Material": "Aluminio + plástico",
      "Peso": "1000g"
    },
    "stock": 10,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 149.99,
      "precioOferta": 149.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Alfombrilla Gaming Logitech G Powerplay",
    "marca": "Logitech G",
    "categoria": "gaming",
    "precio": 119.99,
    "imagen": "/img/productos/logitech-g-powerplay.webp",
    "descripcion": "Alfombrilla con carga inalámbrica integrada para mouse Logitech G.",
    "descripcionDetallada": "La Logitech G Powerplay es la alfombrilla definitiva para gamers. Con tecnología de carga inalámbrica integrada, mantiene tu mouse Logitech G siempre cargado mientras juegas. Incluye dos superficies intercambiables (suave y dura).",
    "caracteristicas": [
      "Carga inalámbrica integrada",
      "Dos superficies intercambiables",
      "Compatible con todos los mouse Logitech G",
      "LED indicador de carga",
      "Diseño antideslizante",
      "Cable USB-C de 2m incluido"
    ],
    "especificaciones": {
      "Dimensiones": "350 x 320 x 15mm",
      "Carga": "Inalámbrica Powerplay",
      "Superficies": "Suave y dura incluidas",
      "Compatibilidad": "Mouse Logitech G",
      "Conexión": "USB-C",
      "Peso": "450g"
    },
    "stock": 8,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 20,
      "precioOriginal": 119.99,
      "precioOferta": 95.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Oferta"
    }
  },
  {
    "nombre": "Auriculares Gaming HyperX Cloud Alpha S",
    "marca": "HyperX",
    "categoria": "gaming",
    "precio": 129.99,
    "imagen": "/img/productos/hyperx-cloud-alpha-s.webp",
    "descripcion": "Auriculares gaming con tecnología de doble cámara y controles de audio avanzados.",
    "descripcionDetallada": "Los HyperX Cloud Alpha S ofrecen la mejor experiencia de audio gaming. Con tecnología de doble cámara, controles de ajuste de graves, sonido envolvente 7.1 y micrófono con cancelación de ruido, son perfectos para gamers exigentes.",
    "caracteristicas": [
      "Tecnología de doble cámara de sonido",
      "Controles de ajuste de graves",
      "Sonido envolvente 7.1 virtual",
      "Micrófono desmontable con cancelación de ruido",
      "Almohadillas de espuma viscoelástica",
      "Cable USB y Jack 3.5mm incluidos"
    ],
    "especificaciones": {
      "Drivers": "50mm con doble cámara",
      "Sonido": "7.1 envolvente",
      "Graves": "Ajuste manual",
      "Conexión": "USB + Jack 3.5mm",
      "Frecuencia": "13Hz - 27000Hz",
      "Peso": "316g"
    },
    "stock": 12,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 129.99,
      "precioOferta": 129.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Auriculares Gaming HyperX Cloud Flight",
    "marca": "HyperX",
    "categoria": "gaming",
    "precio": 139.99,
    "imagen": "/img/productos/hyperx-cloud-flight.webp",
    "descripcion": "Auriculares gaming inalámbricos con batería de 30 horas y sonido envolvente.",
    "descripcionDetallada": "Los HyperX Cloud Flight son los auriculares inalámbricos definitivos para gamers. Con batería de 30 horas, sonido envolvente, micrófono con cancelación de ruido y diseño ligero, son perfectos para largas sesiones de juego sin cables.",
    "caracteristicas": [
      "Batería de 30 horas",
      "Conectividad inalámbrica 2.4GHz",
      "Sonido envolvente 7.1 virtual",
      "Micrófono con cancelación de ruido",
      "Almohadillas de espuma viscoelástica",
      "Carga por USB-C"
    ],
    "especificaciones": {
      "Batería": "30 horas",
      "Conectividad": "Inalámbrico 2.4GHz",
      "Sonido": "7.1 envolvente",
      "Micrófono": "Cancelación de ruido",
      "Frecuencia": "10Hz - 21000Hz",
      "Peso": "310g"
    },
    "stock": 7,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 15,
      "precioOriginal": 139.99,
      "precioOferta": 118.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Auriculares Gaming Logitech G Pro X",
    "marca": "Logitech G",
    "categoria": "gaming",
    "precio": 129.99,
    "imagen": "/img/productos/logitech-g-pro-x.webp",
    "descripcion": "Auriculares gaming profesionales con tecnología Blue VO!CE y sonido DTS 7.1.",
    "descripcionDetallada": "Los Logitech G Pro X son los auriculares preferidos por profesionales de eSports. Con tecnología Blue VO!CE para micrófono, sonido DTS 7.1, drivers de 50mm y diseño de aluminio, ofrecen calidad de audio y comunicación excepcional.",
    "caracteristicas": [
      "Tecnología Blue VO!CE para micrófono",
      "Sonido DTS 7.1",
      "Drivers de 50mm de neodimio",
      "Diseño de aluminio resistente",
      "Cable desmontable con USB",
      "Almohadillas de espuma viscoelástica"
    ],
    "especificaciones": {
      "Drivers": "50mm",
      "Sonido": "DTS 7.1",
      "Micrófono": "Blue VO!CE",
      "Conexión": "USB + Jack 3.5mm",
      "Frecuencia": "10Hz - 25000Hz",
      "Peso": "350g"
    },
    "stock": 10,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 129.99,
      "precioOferta": 129.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Auriculares Gaming Logitech G435 Lightspeed",
    "marca": "Logitech G",
    "categoria": "gaming",
    "precio": 79.99,
    "imagen": "/img/productos/logitech-g435-lightspeed.webp",
    "descripcion": "Auriculares inalámbricos ligeros con conectividad Lightspeed y Bluetooth.",
    "descripcionDetallada": "Los Logitech G435 Lightspeed son auriculares ultraligeros de 165g. Con conectividad Lightspeed y Bluetooth, batería de 18 horas y diseño colorido, son perfectos para gaming y uso diario en múltiples dispositivos.",
    "caracteristicas": [
      "Peso ultraligero de 165g",
      "Conectividad Lightspeed + Bluetooth",
      "Batería de 18 horas",
      "Micrófonos de haz dual",
      "Diseño colorido (negro, blanco, azul)",
      "Sin ruido pasivo"
    ],
    "especificaciones": {
      "Peso": "165g",
      "Conectividad": "Lightspeed + Bluetooth 5.2",
      "Batería": "18 horas",
      "Micrófono": "Dual beamforming",
      "Frecuencia": "10Hz - 22000Hz",
      "Carga": "USB-C"
    },
    "stock": 20,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 10,
      "precioOriginal": 79.99,
      "precioOferta": 71.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Oferta"
    }
  },
  {
    "nombre": "Teclado Mecánico HyperX Alloy Origins 60",
    "marca": "HyperX",
    "categoria": "gaming",
    "precio": 99.99,
    "imagen": "/img/productos/hyperx-alloy-origins-60.webp",
    "descripcion": "Teclado mecánico ultracompacto 60% con switches HyperX Red y RGB.",
    "descripcionDetallada": "El HyperX Alloy Origins 60 es el teclado más compacto de HyperX. Con formato 60% (solo 61 teclas), switches HyperX Red, iluminación RGB y cuerpo de aluminio, es perfecto para gamers con espacio limitado.",
    "caracteristicas": [
      "Formato 60% (61 teclas)",
      "Switches HyperX Red",
      "Iluminación RGB por tecla",
      "Cuerpo de aluminio resistente",
      "Cable USB-C desmontable",
      "Diseño ultracompacto"
    ],
    "especificaciones": {
      "Switches": "HyperX Red",
      "Formato": "60% (61 teclas)",
      "Iluminación": "RGB por tecla",
      "Conexión": "USB-C cableado",
      "Material": "Aluminio",
      "Peso": "650g"
    },
    "stock": 12,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 99.99,
      "precioOferta": 99.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Auriculares Gaming Logitech G733 Lightspeed",
    "marca": "Logitech G",
    "categoria": "gaming",
    "precio": 149.99,
    "imagen": "/img/productos/logitech-g733-lightspeed.webp",
    "descripcion": "Auriculares inalámbricos con iluminación RGB y micrófono Blue VO!CE.",
    "descripcionDetallada": "Los Logitech G733 Lightspeed combinan estilo y rendimiento. Con iluminación RGB, micrófono Blue VO!CE, conectividad Lightspeed y batería de 29 horas, son los auriculares perfectos para gamers que buscan personalización y calidad.",
    "caracteristicas": [
      "Iluminación RGB LIGHTSYNC",
      "Micrófono Blue VO!CE",
      "Conectividad Lightspeed",
      "Batería de 29 horas",
      "Peso ligero de 278g",
      "Diseño con diadema de suspensión"
    ],
    "especificaciones": {
      "Peso": "278g",
      "Conectividad": "Lightspeed 2.4GHz",
      "Batería": "29 horas",
      "Micrófono": "Blue VO!CE",
      "Iluminación": "RGB LIGHTSYNC",
      "Frecuencia": "10Hz - 24000Hz"
    },
    "stock": 8,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 15,
      "precioOriginal": 149.99,
      "precioOferta": 127.49,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
  },
  {
    "nombre": "Auriculares Inalámbricos Logitech G435 con Bluetooth",
    "marca": "Logitech G",
    "categoria": "audio",
    "precio": 79.99,
    "imagen": "/img/productos/logitech-g435-bluetooth.webp",
    "descripcion": "Auriculares inalámbricos ligeros con Bluetooth para audio y gaming multiplataforma.",
    "descripcionDetallada": "Los Logitech G435 con Bluetooth son auriculares versátiles para gaming, música y llamadas. Con 165g de peso, batería de 18 horas y conectividad Bluetooth 5.2, son perfectos para usar con PC, consolas y dispositivos móviles.",
    "caracteristicas": [
      "Peso ultraligero de 165g",
      "Conectividad Bluetooth 5.2",
      "Batería de 18 horas",
      "Micrófonos integrados con cancelación",
      "Diseño colorido y moderno",
      "Respuesta de frecuencia amplia"
    ],
    "especificaciones": {
      "Peso": "165g",
      "Conectividad": "Bluetooth 5.2",
      "Batería": "18 horas",
      "Drivers": "40mm",
      "Frecuencia": "10Hz - 22000Hz",
      "Carga": "USB-C"
    },
    "stock": 15,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 79.99,
      "precioOferta": 79.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Auriculares HyperX Cloud Earbuds",
    "marca": "HyperX",
    "categoria": "audio",
    "precio": 39.99,
    "imagen": "/img/productos/hyperx-cloud-earbuds.webp",
    "descripcion": "Auriculares intraurales con micrófono para gaming en móvil y PC.",
    "descripcionDetallada": "Los HyperX Cloud Earbuds son la solución perfecta para gaming móvil. Con drivers de 14mm, micrófono integrado y diseño ligero, ofrecen audio de calidad para jugar en cualquier lugar con tu smartphone o Nintendo Switch.",
    "caracteristicas": [
      "Drivers de 14mm",
      "Micrófono integrado",
      "Diseño intraural ligero",
      "3 tamaños de almohadillas",
      "Cable de 1.2m con control",
      "Compatible con PC, PS5, Xbox y Switch"
    ],
    "especificaciones": {
      "Drivers": "14mm",
      "Micrófono": "Integrado",
      "Conexión": "Jack 3.5mm",
      "Frecuencia": "10Hz - 20000Hz",
      "Peso": "18g",
      "Longitud cable": "1.2m"
    },
    "stock": 30,
    "garantia": "12 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 20,
      "precioOriginal": 39.99,
      "precioOferta": 31.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Oferta"
    }
  },
  {
    "nombre": "Auriculares HyperX Cloud MIX Buds",
    "marca": "HyperX",
    "categoria": "audio",
    "precio": 149.99,
    "imagen": "/img/productos/hyperx-cloud-mix-buds.webp",
    "descripcion": "Earbuds inalámbricos con modo de baja latencia para gaming y audio premium.",
    "descripcionDetallada": "Los HyperX Cloud MIX Buds son los primeros earbuds gaming de HyperX. Con conectividad inalámbrica, modo de baja latencia, cancelación de ruido y batería de 10 horas, ofrecen la mejor experiencia para gaming en móvil.",
    "caracteristicas": [
      "Conectividad inalámbrica 2.4GHz + Bluetooth",
      "Modo de baja latencia para gaming",
      "Cancelación activa de ruido",
      "Batería de 10 horas + 30 horas con estuche",
      "Drivers de 12mm",
      "Resistencia IPX5"
    ],
    "especificaciones": {
      "Conectividad": "2.4GHz + Bluetooth 5.2",
      "Batería": "10 horas (+30 con estuche)",
      "Drivers": "12mm",
      "Latencia": "Menos de 30ms",
      "Resistencia": "IPX5",
      "Peso": "8g por earbud"
    },
    "stock": 6,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 149.99,
      "precioOferta": 149.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Auriculares Logitech G335 con Microfóno",
    "marca": "Logitech G",
    "categoria": "audio",
    "precio": 69.99,
    "imagen": "/img/productos/logitech-g335.webp",
    "descripcion": "Auriculares ligeros y coloridos con micrófono para gaming y llamadas.",
    "descripcionDetallada": "Los Logitech G335 son auriculares accesibles con estilo. Con 240g de peso, micrófono giratorio, cable de 3.5mm y diseño cómodo, son perfectos para gamers que buscan calidad sin complicaciones.",
    "caracteristicas": [
      "Peso ligero de 240g",
      "Micrófono giratorio",
      "Cable Jack 3.5mm",
      "Almohadillas de espuma suave",
      "Diseño colorido y moderno",
      "Diadema de suspensión"
    ],
    "especificaciones": {
      "Peso": "240g",
      "Drivers": "40mm",
      "Conectividad": "Jack 3.5mm",
      "Micrófono": "Giratorio",
      "Frecuencia": "10Hz - 22000Hz",
      "Longitud cable": "2.4m"
    },
    "stock": 18,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 15,
      "precioOriginal": 69.99,
      "precioOferta": 59.49,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Oferta"
    }
  },
  {
    "nombre": "Auriculares HyperX Cloud Core 7.1",
    "marca": "HyperX",
    "categoria": "audio",
    "precio": 59.99,
    "imagen": "/img/productos/hyperx-cloud-core-71.webp",
    "descripcion": "Auriculares económicos con sonido envolvente 7.1 para gaming y audio.",
    "descripcionDetallada": "Los HyperX Cloud Core 7.1 ofrecen audio envolvente a un precio accesible. Con drivers de 50mm, sonido 7.1 virtual, almohadillas de espuma viscoelástica y micrófono desmontable, son ideales para gamers con presupuesto limitado.",
    "caracteristicas": [
      "Sonido envolvente 7.1 virtual",
      "Drivers de 50mm",
      "Micrófono desmontable con cancelación",
      "Almohadillas de espuma viscoelástica",
      "Cable USB y Jack 3.5mm",
      "Diseño ligero y cómodo"
    ],
    "especificaciones": {
      "Drivers": "50mm",
      "Sonido": "7.1 virtual",
      "Conexión": "USB + Jack 3.5mm",
      "Micrófono": "Desmontable",
      "Frecuencia": "10Hz - 21000Hz",
      "Peso": "280g"
    },
    "stock": 25,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 59.99,
      "precioOferta": 59.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Auriculares Logitech G333 con Jack 3.5mm",
    "marca": "Logitech G",
    "categoria": "audio",
    "precio": 49.99,
    "imagen": "/img/productos/logitech-g333.webp",
    "descripcion": "Auriculares intraurales con drivers duales para audio de alta calidad.",
    "descripcionDetallada": "Los Logitech G333 son auriculares intraurales con tecnología de drivers duales que separan graves y agudos para un sonido claro y detallado. Ideales para gaming móvil y música.",
    "caracteristicas": [
      "Drivers duales (graves + agudos)",
      "Micrófono integrado",
      "3 tamaños de almohadillas",
      "Cable trenzado de 1.2m",
      "Conector Jack 3.5mm",
      "Diseño ligero y compacto"
    ],
    "especificaciones": {
      "Drivers": "Duales (graves + agudos)",
      "Micrófono": "Integrado",
      "Conexión": "Jack 3.5mm",
      "Longitud cable": "1.2m",
      "Frecuencia": "10Hz - 22000Hz",
      "Peso": "20g"
    },
    "stock": 22,
    "garantia": "12 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 10,
      "precioOriginal": 49.99,
      "precioOferta": 44.99,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Oferta"
    }
  },
  {
    "nombre": "Auriculares Logitech Zone Vibe 100",
    "marca": "Logitech G",
    "categoria": "audio",
    "precio": 99.99,
    "imagen": "/img/productos/logitech-zone-vibe-100.webp",
    "descripcion": "Auriculares inalámbricos con micrófono para trabajo y gaming casual.",
    "descripcionDetallada": "Los Logitech Zone Vibe 100 son auriculares versátiles para trabajo y gaming. Con conectividad Bluetooth, batería de 20 horas, micrófono con cancelación de ruido y diseño ligero de 185g, son ideales para uso diario.",
    "caracteristicas": [
      "Conectividad Bluetooth 5.2",
      "Batería de 20 horas",
      "Micrófono con cancelación de ruido",
      "Peso ligero de 185g",
      "Carga USB-C",
      "Almohadillas de espuma suave"
    ],
    "especificaciones": {
      "Conectividad": "Bluetooth 5.2",
      "Batería": "20 horas",
      "Drivers": "40mm",
      "Micrófono": "Cancelación de ruido",
      "Peso": "185g",
      "Carga": "USB-C"
    },
    "stock": 12,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": false,
      "descuento": 0,
      "precioOriginal": 99.99,
      "precioOferta": 99.99,
      "fechaInicio": null,
      "fechaFin": null,
      "etiqueta": null
    }
  },
  {
    "nombre": "Auriculares HyperX Cloud Orbit S",
    "marca": "HyperX",
    "categoria": "audio",
    "precio": 329.99,
    "imagen": "/img/productos/hyperx-cloud-orbit-s.webp",
    "descripcion": "Auriculares de referencia con audio planar magnético y seguimiento de cabeza 3D.",
    "descripcionDetallada": "Los HyperX Cloud Orbit S ofrecen la mejor calidad de audio gaming. Con tecnología planar magnética, sonido 3D con seguimiento de cabeza Waves Nx y auriculares de referencia, son la elección de audiófilos y gamers exigentes.",
    "caracteristicas": [
      "Drivers planar magnéticos",
      "Tecnología Waves Nx 3D con seguimiento de cabeza",
      "Auriculares de referencia",
      "Cancelación de ruido pasiva",
      "Cable USB-C y Jack 3.5mm",
      "Batería de 10 horas"
    ],
    "especificaciones": {
      "Drivers": "Planar magnéticos",
      "Tecnología": "Waves Nx 3D",
      "Batería": "10 horas",
      "Conexión": "USB-C + Jack 3.5mm",
      "Frecuencia": "10Hz - 50000Hz",
      "Peso": "368g"
    },
    "stock": 4,
    "garantia": "24 meses",
    "ofertaNavideña": {
      "activa": true,
      "descuento": 15,
      "precioOriginal": 329.99,
      "precioOferta": 280.49,
      "fechaInicio": "2025-12-01",
      "fechaFin": "2025-12-31",
      "etiqueta": "Black Friday"
    }
}
];

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("productos");

    // Calcular el siguiente ID disponible
    const ultimoProducto = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    let siguienteId = ultimoProducto.length > 0 ? ultimoProducto[0].id + 1 : 1;
    console.log(`ℹ️  Próximo ID disponible: ${siguienteId}`);

    const productosConId = nuevosProductos.map((producto) => {
      const productoConId = { id: siguienteId, ...producto };
      siguienteId++;
      return productoConId;
    });

    const resultado = await collection.insertMany(productosConId);
    console.log(`✅ Se insertaron ${resultado.insertedCount} productos correctamente`);
    console.log(`📦 IDs insertados: ${productosConId.map((p) => p.id).join(", ")}`);
  } catch (error) {
    console.error("❌ Error al insertar productos:", error);
  } finally {
    await client.close();
    console.log("🔌 Conexión cerrada");
  }
}

main();