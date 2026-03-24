import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, Loader2, Lock, Smartphone } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface PeraWalletModalProps {
  open: boolean;
  onClose: () => void;
}

// Static QR pattern encoded as a flat list of {row, col, filled} cells
const QR_CELLS: { row: number; col: number; filled: boolean }[] = (() => {
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];
  const cells: { row: number; col: number; filled: boolean }[] = [];
  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      cells.push({ row: r, col: c, filled: pattern[r][c] === 1 });
    }
  }
  return cells;
})();

function QrCodePlaceholder() {
  // Group cells by row for rendering
  const rows: { row: number; cells: typeof QR_CELLS }[] = [];
  for (let r = 0; r < 7; r++) {
    rows.push({ row: r, cells: QR_CELLS.filter((c) => c.row === r) });
  }
  return (
    <div className="flex flex-col items-center gap-0.5 p-3 bg-white/5 rounded-xl border border-[#00d4aa]/20">
      {rows.map(({ row, cells }) => (
        <div key={`qr-row-${row}`} className="flex gap-0.5">
          {cells.map(({ col, filled }) => (
            <div
              key={`qr-${row}-${col}`}
              className={`w-3 h-3 rounded-sm ${filled ? "bg-[#00d4aa]" : "bg-transparent"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PeraWalletModal({ open, onClose }: PeraWalletModalProps) {
  const { login, loginStatus } = useInternetIdentity();
  const isConnecting = loginStatus === "logging-in";

  useEffect(() => {
    if (loginStatus === "success") {
      onClose();
    }
  }, [loginStatus, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-[#1a1f2e] border border-[#00d4aa]/30 max-w-sm p-0 overflow-hidden"
        data-ocid="pera.dialog"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00d4aa] flex items-center justify-center shadow-[0_0_20px_#00d4aa55]">
              <span className="text-black font-black text-lg">P</span>
            </div>
            <div>
              <DialogTitle className="text-white text-base font-bold">
                Connect Pera Wallet
              </DialogTitle>
              <p className="text-xs text-gray-400 mt-0.5">
                Connect your Algorand wallet to AgentNexus
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-3">
          {isConnecting ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 className="w-10 h-10 text-[#00d4aa] animate-spin" />
              <p className="text-sm text-gray-300">
                Connecting to Internet Identity...
              </p>
            </div>
          ) : (
            <>
              {/* Pera Mobile option */}
              <button
                type="button"
                onClick={login}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#00d4aa]/30 bg-[#00d4aa]/5 hover:bg-[#00d4aa]/10 hover:border-[#00d4aa]/60 transition-all group"
                data-ocid="pera.mobile.button"
              >
                <div className="w-10 h-10 rounded-lg bg-[#00d4aa]/20 flex items-center justify-center group-hover:bg-[#00d4aa]/30 transition-colors">
                  <Smartphone className="w-5 h-5 text-[#00d4aa]" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold">
                    Pera Mobile
                  </p>
                  <p className="text-gray-400 text-xs">
                    Scan with Pera mobile app
                  </p>
                </div>
              </button>

              {/* Pera Web option */}
              <button
                type="button"
                onClick={login}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#00d4aa]/30 transition-all group"
                data-ocid="pera.web.button"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[#00d4aa]/20 transition-colors">
                  <Globe className="w-5 h-5 text-gray-300 group-hover:text-[#00d4aa]" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold">Pera Web</p>
                  <p className="text-gray-400 text-xs">
                    Connect via Pera Web wallet
                  </p>
                </div>
              </button>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-2 pt-2">
                <p className="text-xs text-gray-500">Or scan QR code</p>
                <QrCodePlaceholder />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-500">
            Powered by Pera · Algorand
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
