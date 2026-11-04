import React from 'react';
import { EQUIPMENT_ASSETS } from '../constants/initialData';
import { AppView, Resource } from '../types';

interface AssetsManagementViewProps {
  onNavigate: (view: AppView) => void;
  onSelectResourceForBooking: (resource: Resource) => void;
}

export const AssetsManagementView: React.FC<AssetsManagementViewProps> = ({
  onNavigate,
  onSelectResourceForBooking,
}) => {
  return (
    <div className="w-full px-3 sm:px-6 md:px-8 py-4 sm:py-6 max-w-7xl mx-auto flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb & Title: Unified to '자산 예약' */}
          <div className="flex items-center gap-1.5 text-[#45474b] text-[11px]">
            <span>자산 예약</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#02060e] font-semibold text-xs">공용 비품 대여 신청</span>
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#191c1e] tracking-tight mt-1">
            자산 예약
          </h1>
          <p className="text-xs text-[#45474b] mt-0.5">
            촬영 장비, 모니터, 무선 마이크 등 사내 공용 IT 비품 자산을 확인하고 대여·예약합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectResourceForBooking(EQUIPMENT_ASSETS[0])}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#006c4a] hover:bg-[#00714e] text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>새 자산 대여 신청</span>
        </button>
      </div>

      {/* Grid of Equipment Assets ONLY (No meeting rooms) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EQUIPMENT_ASSETS.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs flex flex-col justify-between gap-4 hover:border-[#c5c6cb] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#f2f4f6] text-[#45474b]">
                  {res.categoryLabel}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#006c4a] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#006c4a]"></span>
                  사용 가능
                </span>
              </div>

              <h3 className="text-[17px] font-bold text-[#191c1e]">{res.name}</h3>
              <p className="text-xs text-[#45474b] mt-0.5">{res.subtitle}</p>

              <div className="mt-3 pt-3 border-t border-[#f2f4f6] flex flex-col gap-1.5 text-xs text-[#45474b]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#75777c]">location_on</span>
                  <span>{res.location}</span>
                </div>
                {res.capacity && (
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#75777c]">inventory_2</span>
                    <span>보관 수량: {res.capacity}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {res.specs.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-[#f2f4f6] text-[10px] text-[#45474b]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectResourceForBooking(res)}
              className="w-full py-2.5 rounded-xl bg-[#02060e] hover:bg-[#191f28] text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>이 비품 대여하기</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
