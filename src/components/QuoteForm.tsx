"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Paperclip, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ServiceOption {
  slug: string;
  name: string;
}

export default function QuoteForm({ services = [] }: { services?: ServiceOption[] }) {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = locale === "ar" ? "الاسم مطلوب" : "Name is required";
    if (!phone.trim()) {
      errs.phone = locale === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(phone)) {
      errs.phone = locale === "ar" ? "رقم هاتف غير صالح" : "Invalid phone number";
    }
    if (!serviceType) errs.serviceType = locale === "ar" ? "يرجى اختيار نوع الخدمة" : "Please select a service";
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setStatus("idle");

    try {
      // In production, we'd handle file upload to Cloud/S3 and get fileUrl.
      // For now, we mock the fileUrl or send form data.
      const mockFileUrl = file ? `/uploads/${Date.now()}_${file.name}` : null;

      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          serviceType,
          fileUrl: mockFileUrl,
          notes,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setName("");
        setPhone("");
        setServiceType("");
        setFile(null);
        setNotes("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const defaultServices = [
    { slug: "certified", name: locale === "ar" ? "ترجمة معتمدة" : "Certified Translation" },
    { slug: "localization", name: locale === "ar" ? "توطين مواقع وتطبيقات" : "Localization" },
    { slug: "interpretation", name: locale === "ar" ? "ترجمة فورية للمؤتمرات" : "Interpretation" },
  ];

  const activeServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-100 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Decorative colored corner */}
      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-primary-blue/20 to-transparent pointer-events-none"></div>

      <h3 className="text-xl font-bold text-dark-navy mb-2 flex items-center gap-2 border-b border-gray-100 pb-4">
        <span>{t("title")}</span>
      </h3>
      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
        {t("subtitle")}
      </p>

      {status === "success" && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-green-50 p-4 text-green-800 border border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold">{locale === "ar" ? "تم بنجاح!" : "Submitted!"}</p>
            <p className="text-xs mt-1 text-green-700">{t("success")}</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold">{locale === "ar" ? "خطأ!" : "Error!"}</p>
            <p className="text-xs mt-1 text-red-700">{t("error")}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-bold text-dark-navy mb-1.5">{t("name")} *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full rounded-xl border ${
              errors.name ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-primary-blue/20"
            } px-4 py-3 text-xs bg-gray-50/50 outline-none focus:bg-white focus:ring-4 transition-all`}
            placeholder={locale === "ar" ? "مثال: أحمد محمد" : "e.g., John Doe"}
          />
          {errors.name && <span className="text-[10px] text-red-500 mt-1 block">{errors.name}</span>}
        </div>

        {/* Phone Input */}
        <div>
          <label className="block text-xs font-bold text-dark-navy mb-1.5">{t("phone")} *</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full rounded-xl border ${
              errors.phone ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-primary-blue/20"
            } px-4 py-3 text-xs bg-gray-50/50 outline-none focus:bg-white focus:ring-4 transition-all`}
            placeholder={locale === "ar" ? "مثال: +201555592535" : "e.g., +201555592535"}
          />
          {errors.phone && <span className="text-[10px] text-red-500 mt-1 block">{errors.phone}</span>}
        </div>

        {/* Service Dropdown */}
        <div>
          <label className="block text-xs font-bold text-dark-navy mb-1.5">{t("serviceType")} *</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className={`w-full rounded-xl border ${
              errors.serviceType ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-primary-blue/20"
            } px-4 py-3 text-xs bg-gray-50/50 outline-none focus:bg-white focus:ring-4 transition-all`}
          >
            <option value="">{locale === "ar" ? "اختر الخدمة..." : "Select Service..."}</option>
            {activeServices.map((srv) => (
              <option key={srv.slug} value={srv.slug}>
                {srv.name}
              </option>
            ))}
          </select>
          {errors.serviceType && <span className="text-[10px] text-red-500 mt-1 block">{errors.serviceType}</span>}
        </div>

        {/* File Attachment */}
        <div>
          <label className="block text-xs font-bold text-dark-navy mb-1.5">{t("file")}</label>
          <div className="relative flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-4 px-6 hover:bg-gray-50/50 transition-colors cursor-pointer">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Paperclip className="h-5 w-5 text-gray-400" />
              <span className="text-xs text-gray-500 font-semibold">
                {file ? file.name : locale === "ar" ? "اختر ملفاً أو اسحبه هنا" : "Choose file or drag & drop"}
              </span>
              <span className="text-[9px] text-gray-400">PDF, JPG, PNG (Max 10MB)</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-dark-navy mb-1.5">{t("notes")}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 focus:ring-primary-blue/20 px-4 py-3 text-xs bg-gray-50/50 outline-none focus:bg-white focus:ring-4 transition-all"
            placeholder={locale === "ar" ? "اكتب أي متطلبات إضافية هنا..." : "Write any additional details here..."}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-yellow-500 py-3.5 text-xs font-bold text-dark-navy shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{locale === "ar" ? "جاري الإرسال..." : "Sending..."}</span>
            </>
          ) : (
            <span>{t("submit")}</span>
          )}
        </button>
      </form>
    </div>
  );
}
