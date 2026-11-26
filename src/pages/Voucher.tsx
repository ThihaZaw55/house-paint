import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTitle from "../components/ui/PageTitle";
import PaymentService from "../services/payment.service";
import type { VoucherResponse } from "../types/payment";

const formatDate = (value: string) => {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

export const Voucher: React.FC = () => {
  const [reference, setReference] = useState("");
  const [voucher, setVoucher] = useState<VoucherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  useEffect(() => {
    const navigationState = location.state as { reference?: string } | null;
    const searchParams = new URLSearchParams(location.search);
    const ref = navigationState?.reference || searchParams.get("reference") || "";

    if (ref) {
      setReference(ref);
      handleSearch(ref);
    }
  }, [location.search, location.state]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (ref: string) => {
    if (!ref.trim()) {
      setError("Enter an invoice number, sale ID, or payment ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await PaymentService.getVoucher(ref.trim());
      const data = "data" in result ? result.data : result;

      if (!data) {
        throw new Error("Voucher not found.");
      }

      setVoucher(data);
    } catch (requestError: unknown) {
      setVoucher(null);
      const axiosError = requestError as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || "Failed to load voucher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="print:hidden">
        <PageTitle title="Voucher" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(reference);
        }}
        className="print:hidden flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
      >
        <input
          type="text"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          placeholder="Invoice / Sale ID / Payment ID"
          className="min-h-11 flex-1 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Loading..." : "Find Voucher"}
        </button>
        {voucher && (
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Print
          </button>
        )}
      </form>

      {error && (
        <div className="print:hidden rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {voucher && (
        <article className="voucher-sheet mx-auto w-full max-w-[210mm] bg-white p-6 text-slate-800 shadow-lg sm:p-8">
          <header className="border-b-2 border-slate-800 pb-4 text-center">
            <h1 className="text-2xl font-bold tracking-wide">SALES VOUCHER</h1>
            <p className="mt-1 text-sm text-slate-500">House Paint &amp; Building Materials</p>
          </header>

          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <p><span className="font-semibold">Invoice:</span> {voucher.invoice}</p>
              <p className="mt-2"><span className="font-semibold">Customer:</span> {voucher.customerName || "Walk-in Customer"}</p>
              <p className="mt-2"><span className="font-semibold">Phone:</span> {voucher.phone || "-"}</p>
            </div>
            <div className="text-right">
              <p><span className="font-semibold">Sale Date:</span> {formatDate(voucher.saleDate)}</p>
              <p className="mt-2"><span className="font-semibold">Payment Date:</span> {formatDate(voucher.paymentDate)}</p>
              <p className="mt-2"><span className="font-semibold">Status:</span> {voucher.status}</p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-y-2 border-slate-800 bg-slate-50">
                  <th className="px-2 py-2 text-left">#</th>
                  <th className="px-2 py-2 text-left">Item</th>
                  <th className="px-2 py-2 text-left">Unit</th>
                  <th className="px-2 py-2 text-right">Qty</th>
                  <th className="px-2 py-2 text-right">Price</th>
                  <th className="px-2 py-2 text-right">Discount</th>
                  <th className="px-2 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {voucher.items?.map((item, index) => (
                  <tr key={`${item.productId}-${index}`} className="border-b border-slate-300">
                    <td className="px-2 py-3">{index + 1}</td>
                    <td className="px-2 py-3 font-medium">{item.itemName}</td>
                    <td className="px-2 py-3">{item.unitName}</td>
                    <td className="px-2 py-3 text-right">{formatMoney(item.quantity)}</td>
                    <td className="px-2 py-3 text-right">{formatMoney(item.salesPrice)}</td>
                    <td className="px-2 py-3 text-right">{formatMoney(item.discountPrice)}</td>
                    <td className="px-2 py-3 text-right font-semibold">{formatMoney(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ml-auto mt-6 w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between border-t-2 border-slate-800 pt-3 text-lg font-bold">
              <span>Total</span>
              <span>{formatMoney(voucher.totalAmount)} K</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid</span>
              <span>{formatMoney(voucher.amountPaid)} K</span>
            </div>
            <div className="flex justify-between">
              <span>Change</span>
              <span>{formatMoney(voucher.changeAmount)} K</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span>{voucher.paymentMethod}</span>
            </div>
          </div>

          {voucher.note && (
            <div className="mt-5 rounded border border-slate-200 bg-slate-50 p-3 text-sm">
              <span className="font-semibold">Note:</span> {voucher.note}
            </div>
          )}

          <footer className="mt-12 flex justify-between px-4 text-sm">
            <div className="border-t border-slate-600 px-5 pt-2">Customer Signature</div>
            <div className="border-t border-slate-600 px-5 pt-2">Authorized Signature</div>
          </footer>
        </article>
      )}

      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          body { background: white !important; }
          aside, nav, .print\\:hidden { display: none !important; }
          .voucher-sheet { max-width: none !important; width: 100% !important; padding: 0 !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Voucher;