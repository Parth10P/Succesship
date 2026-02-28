// backend/controllers/invoiceController.js
const prisma = require("../config/prismaClient");

const getInvoices = async (req, res) => {
  try {
    // We use a regular findMany first to avoid the "Inconsistent query result" error
    // if a supplier is missing due to a required relation.
    const rawInvoices = await prisma.invoice.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Manually fetch suppliers or filter out orphans to be safe
    const invoicesWithSuppliers = await Promise.all(
      rawInvoices.map(async (invoice) => {
        const supplier = await prisma.supplier.findUnique({
          where: { id: invoice.supplierId },
        });
        return supplier ? { ...invoice, supplier } : null;
      }),
    );

    // Filter out any invoices that don't have a valid supplier record
    const validInvoices = invoicesWithSuppliers.filter(Boolean);

    const formattedInvoices = validInvoices.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount,
      date: invoice.date,
      description: invoice.description,
      status: invoice.status,
      createdAt: invoice.createdAt,
      supplier: {
        name: invoice.supplier.name,
      },
    }));

    res.json(formattedInvoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

module.exports = { getInvoices };
