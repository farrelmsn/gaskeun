"use client";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SalesRecord, StockTransferDO, AgentEntity } from "@/types";
import { PRODUCTS } from "@/data/mockData";

export async function exportSalesToExcel(
  records: SalesRecord[],
  title: string,
  filename = "Laporan_Penjualan_GasNPSO.xlsx"
) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Laporan Penjualan");

  ws.mergeCells("A1:H1");
  ws.getCell("A1").value = `PT PERTAMINA PATRA NIAGA - SALES AREA RETAIL BANDUNG`;
  ws.getCell("A1").font = { bold: true, size: 13, color: { argb: "FF0055B8" } };

  ws.mergeCells("A2:H2");
  ws.getCell("A2").value = title;
  ws.getCell("A2").font = { bold: true, size: 11 };

  ws.addRow([]);
  const headerRow = ws.addRow([
    "No",
    "Tanggal",
    "Outlet / Pangkalan",
    "Agen Pembina",
    "Pembeli",
    "Produk LPG NPSO",
    "Jumlah (Tbg)",
    "Total Nilai (Rp)",
  ]);

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0055B8" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  records.forEach((rec, i) => {
    ws.addRow([
      i + 1,
      rec.date,
      rec.outletName,
      rec.agentName,
      rec.buyerName,
      rec.productName,
      rec.quantity,
      rec.total,
    ]);
  });

  const totalQty = records.reduce((a, b) => a + b.quantity, 0);
  const totalVal = records.reduce((a, b) => a + b.total, 0);
  const footerRow = ws.addRow(["", "", "", "", "", "TOTAL", totalQty, totalVal]);
  footerRow.font = { bold: true };

  ws.columns = [
    { width: 6 },
    { width: 14 },
    { width: 28 },
    { width: 26 },
    { width: 26 },
    { width: 22 },
    { width: 14 },
    { width: 18 },
  ];

  const buffer = await wb.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename
  );
}

export function exportSalesToPDF(
  records: SalesRecord[],
  title: string,
  subtitle: string,
  filename = "Laporan_Penjualan_GasNPSO.pdf"
) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.setTextColor(0, 85, 184);
  doc.text("PT PERTAMINA PATRA NIAGA — SALES AREA RETAIL BANDUNG", 14, 16);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(title, 14, 23);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`${subtitle} • Dicetak pada ${new Date().toLocaleString("id-ID")}`, 14, 29);

  autoTable(doc, {
    startY: 34,
    head: [["No", "Tanggal", "Outlet", "Agen", "Pembeli", "Varian LPG", "Jml", "Total (Rp)"]],
    body: records.map((r, i) => [
      i + 1,
      r.date,
      r.outletName,
      r.agentName,
      r.buyerName,
      r.productName,
      `${r.quantity} Tbg`,
      `Rp ${r.total.toLocaleString("id-ID")}`,
    ]),
    headStyles: { fillColor: [0, 85, 184] },
    styles: { fontSize: 8 },
  });

  doc.save(filename);
}

export function exportSuratJalanPDF(trf: StockTransferDO, agent: AgentEntity) {
  const doc = new jsPDF();
  doc.setFontSize(10);
  doc.setTextColor(237, 28, 36);
  doc.text("PT PERTAMINA PATRA NIAGA | DISTRIBUSI RESMI LPG NON-SUBSIDI", 14, 16);

  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text("SURAT JALAN PENGIRIMAN LPG NON-SUBSIDI", 14, 24);

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`No. Dokumen: ${trf.docNo}   |   Tanggal: ${trf.date}   |   Status: ${trf.status}`, 14, 31);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 35, 196, 35);

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("PENGIRIM (AGEN RESMI):", 14, 43);
  doc.text(trf.agentName, 14, 49);
  doc.setTextColor(100, 116, 139);
  doc.text(agent.address.slice(0, 55), 14, 54);
  doc.text(`PIC: ${agent.pic} (${agent.phone})`, 14, 59);

  doc.setTextColor(15, 23, 42);
  doc.text("PENERIMA (PANGKALAN BINAAN):", 115, 43);
  doc.text(trf.outletName, 115, 49);
  doc.setTextColor(100, 116, 139);
  doc.text(`Armada/Catatan: ${trf.driverNote}`, 115, 54);

  const totalMuatan = Object.values(trf.items).reduce((a, b) => a + b, 0);

  autoTable(doc, {
    startY: 68,
    head: [["No", "Kode SKU", "Varian Produk", "Kondisi", "Jumlah (Tabung)"]],
    body: PRODUCTS.map((p, idx) => [
      idx + 1,
      p.sku,
      p.shortName,
      "Ready",
      `${trf.items[p.key]} Tabung`,
    ]),
    foot: [["", "", "", "TOTAL MUATAN", `${totalMuatan} Tabung`]],
    headStyles: { fillColor: [0, 85, 184] },
    footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold" },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 130;
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("YANG MENYERAHKAN (DRIVER)", 20, finalY + 18);
  doc.text("YANG MENERIMA (PANGKALAN)", 82, finalY + 18);
  doc.text("MENGETAHUI (PIMPINAN AGEN)", 145, finalY + 18);

  doc.text("( Petugas Pengiriman )", 23, finalY + 38);
  doc.text(`( ${trf.outletName.slice(0, 18)} )`, 83, finalY + 38);
  doc.text(`( ${agent.pic} )`, 150, finalY + 38);

  doc.save(`Surat_Jalan_${trf.docNo}.pdf`);
}
