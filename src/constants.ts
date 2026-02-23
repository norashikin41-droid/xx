
import { Question } from './types';

export const QUESTIONS_LEVEL_1: Question[] = [
  { id: 1, text: "Kira perimeter sebuah segi empat tepat dengan panjang 8cm dan lebar 5cm.", answer: 26, unit: "cm" },
  { id: 2, text: "Sebuah segi empat sama mempunyai sisi 6cm. Berapakah perimeternya?", answer: 24, unit: "cm" },
  { id: 3, text: "Kira perimeter sebuah segitiga sama sisi dengan panjang sisi 7cm.", answer: 21, unit: "cm" },
  { id: 4, text: "Sebuah trapezium mempunyai sisi selari 5cm dan 9cm serta dua sisi lain 4cm dan 3cm. Kirakan perimeternya.", answer: 21, unit: "cm" },
  { id: 5, text: "Kira perimeter sebuah segi empat tepat dengan panjang 12cm dan lebar 4cm.", answer: 32, unit: "cm" },
  { id: 6, text: "Sebuah segitiga mempunyai sisi 3cm, 4cm dan 5cm. Berapakah perimeternya?", answer: 12, unit: "cm" },
  { id: 7, text: "Sebuah segi empat sama mempunyai perimeter 40cm. Berapakah panjang satu sisinya?", answer: 10, unit: "cm" },
  { id: 8, text: "Trapezium: Sisi selari = 10cm & 12cm, sisi condong = 5cm & 5cm. Kira perimeter.", answer: 32, unit: "cm" },
  { id: 9, text: "Segi empat tepat: Panjang = 15cm, Lebar = 10cm. Kira perimeter.", answer: 50, unit: "cm" },
  { id: 10, text: "Segitiga sama kaki: Tapak = 6cm, Sisi sama = 5cm. Kira perimeter.", answer: 16, unit: "cm" },
];

export const QUESTIONS_LEVEL_2: Question[] = [
  { id: 1, text: "Kira luas sebuah trapezium dengan sisi selari 4cm dan 6cm, serta tinggi 5cm.", answer: 25, unit: "cm²" },
  { id: 2, text: "Kira jumlah luas permukaan sebuah kuboid dengan dimensi 2cm x 3cm x 4cm.", answer: 52, unit: "cm²" },
  { id: 3, text: "Kira luas permukaan sebuah silinder (guna π = 22/7) dengan jejari 7cm dan tinggi 10cm. (Formula: 2πr² + 2πrh)", answer: 748, unit: "cm²" },
  { id: 4, text: "Kira luas permukaan sebuah kon (guna π = 22/7) dengan jejari 7cm dan tinggi sendeng 13cm. (Formula: πr² + πrs)", answer: 440, unit: "cm²" },
  { id: 5, text: "Sebuah kubus mempunyai sisi 4cm. Kira jumlah luas permukaannya.", answer: 96, unit: "cm²" },
  { id: 6, text: "Kira luas trapezium: Sisi selari = 8cm & 12cm, Tinggi = 6cm.", answer: 60, unit: "cm²" },
  { id: 7, text: "Gabungan bongkah: Dua kubus bersisi 3cm dicantumkan. Kira jumlah luas permukaan bongkah baharu.", answer: 90, unit: "cm²" },
  { id: 8, text: "Silinder: Jejari = 14cm, Tinggi = 5cm. Kira luas permukaan melengkung sahaja (2πrh). (π = 22/7)", answer: 440, unit: "cm²" },
  { id: 9, text: "Kuboid: Panjang = 10cm, Lebar = 5cm, Tinggi = 2cm. Kira jumlah luas permukaan.", answer: 160, unit: "cm²" },
  { id: 10, text: "Kon: Jejari = 7cm, Tinggi sendeng = 10cm. Kira luas permukaan melengkung (πrs). (π = 22/7)", answer: 220, unit: "cm²" },
];

export const QUESTIONS_LEVEL_3: Question[] = [
  { id: 1, text: "Ali ingin memagar kebunnya yang berbentuk segi empat tepat (10m x 15m). Berapakah panjang pagar yang diperlukan?", answer: 50, unit: "m" },
  { id: 2, text: "Sebuah bilik berukuran 4m x 5m hendak dipasang jubin. Jika harga jubin ialah RM20 semeter persegi, berapakah kosnya?", answer: 400, unit: "RM" },
  { id: 3, text: "Sebuah meja bulat mempunyai jejari 70cm. Kira luas meja tersebut dalam cm². (π = 22/7)", answer: 15400, unit: "cm²" },
  { id: 4, text: "Siti ingin mengecat dinding setinggi 3m dan sepanjang 6m. Jika satu tin cat boleh meliputi 9m², berapa tin cat diperlukan?", answer: 2, unit: "tin" },
  { id: 5, text: "Sebuah padang bola mempunyai perimeter 300m. Jika lebarnya 60m, berapakah panjangnya?", answer: 90, unit: "m" },
  { id: 6, text: "Sebuah kotak hadiah berbentuk kubus mempunyai luas permukaan 150cm². Berapakah panjang sisinya?", answer: 5, unit: "cm" },
  { id: 7, text: "Kira luas kawasan berlorek: Segi empat tepat (10x8) ditolak bulatan di tengah (jejari 7). (π = 22/7)", answer: -74, unit: "cm²", hint: "Ops, luas bulatan (154) lebih besar dari segi empat (80). Cuba: Segi empat (20x10) - bulatan (jejari 7)." },
  { id: 8, text: "Betulkan: Segi empat (20x10) ditolak bulatan di tengah (jejari 7). Kira luas baki. (π = 22/7)", answer: 46, unit: "cm²" },
  { id: 9, text: "Sebuah bingkai gambar mempunyai lebar 2cm di sekeliling gambar bersaiz 10cm x 15cm. Kira perimeter luar bingkai.", answer: 66, unit: "cm" },
  { id: 10, text: "Sebuah kolam renang (20m x 10m) dikelilingi laluan pejalan kaki selebar 1m. Kira luas laluan tersebut.", answer: 64, unit: "m²" },
];
