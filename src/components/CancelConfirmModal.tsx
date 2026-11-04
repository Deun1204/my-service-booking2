import React from 'react';

interface CancelConfirmModalProps {
  isOpen: boolean;
  resourceName: string;
  timeRange?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  isOpen,
  resourceName,
  timeRange,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02060e]/40 backdrop-blur-xs transition-all animate-in fade-in duration-150">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150 border border-[#e6e8ea] z-10">
        {/* Header with warning icon */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">event_busy</span>
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-[#191c1e] tracking-tight">
              예약을 취소하시겠습니까?
            </h3>
            <p className="text-xs text-[#45474b] mt-0.5 leading-relaxed">
              취소하시면 배정된 슬롯이 즉시 반환되어 다른 동료가 예약할 수 있게 됩니다.
            </p>
          </div>
        </div>

        {/* Target reservation details box */}
        <div className="bg-[#f8f9fb] p-3.5 rounded-2xl border border-[#e6e8ea] flex flex-col gap-1">
          <span className="text-[11px] text-[#45474b] font-medium">취소 대상 예약</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#191c1e]">{resourceName}</span>
            {timeRange && (
              <span className="text-xs text-[#006c4a] font-semibold bg-[#82f5c1]/30 px-2 py-0.5 rounded-md">
                {timeRange}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#45474b] hover:text-[#191c1e] text-xs font-semibold transition-all active:scale-95"
          >
            돌아가기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            <span>취소 확정</span>
          </button>
        </div>
      </div>
    </div>
  );
};
