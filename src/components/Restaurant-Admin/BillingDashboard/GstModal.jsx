import React, { useEffect, useState } from "react";
import { X, BadgePercent } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';
const GstModal = ({ open, onClose, onSave }) => {
  const [gst, setGst] = useState("");

  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem("gst_percent") || "5";
      setGst(saved)
    }
  }, [open])

  if (!open) return null;

  const handleSave = () => {
    const gstValue = Number(gst);

    if (gstValue < 0 || gstValue > 28 || isNaN(gstValue)) {
      toast.warn("Enter valid GST between 0 to 28%");
      return;
    }
    localStorage.setItem("gst_percent", gstValue);
    onSave?.(gstValue);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      <div
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-sm"
      />

      {/* card */}
      <div className="relative z-10  w-[92%] max-w-md bg-white rounded-2xl shadow-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <BadgePercent className="text-[var(--primary-color)]" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">GST Settings</h2>
              <p className="text-sm text-gray-500">
                Set GST percentage for billing.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            x
          </button>
        </div>

        {/* input */}
        <label className="text-sm font-medium text-gray-700">
          GST Percentage(%)
        </label>
        <input type="number"
          value={gst}
          onChange={(e) => setGst(e.target.value)}
          onWheel={(e) => e.target.blur()}
          placeholder="e.g 5"
          className="w-full no-spinner mt-2 border rounded-lg px-3 py-2 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
        />

        {/* buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white font-semibold text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default GstModal;


