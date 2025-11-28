import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Search,
    Info,
    AlertTriangle,
    Heart,
    X,
    ChevronRight,
    Activity,
    ShieldAlert,
    Baby,
    Clock,
    Stethoscope,
    Upload,
    DollarSign,
    UserCheck,
    Database,
    RefreshCw,
    ExternalLink,
    Shield,
    Stethoscope as StethIcon,
    Sun,
    Moon,
    Beaker,
    Droplets,
    Syringe,
    FileText,
    FileHeart,
    Wind,
    Brain,
    TestTube2,
    Apple,
    Waves,
    Zap,
    Scissors,
    Bone,
    MessageSquare,
    Pill,
    CheckCircle2,
    GraduationCap,
    HeartHandshake,
    Dna,
    Siren,
    Users,
    Camera
} from 'lucide-react';

// --- FORMULARY DATA ---
import FORMULARY_DATA from './formularyData.json';

// --- DILUTION DATA ---
import { DILUTION_DATA, DILUTION_METADATA } from './dilutionData.js';

// --- PAEDIATRIC DATA ---
import { PAEDIATRIC_SECTIONS, PAEDIATRIC_METADATA } from './paediatricData.js';
import { PAEDIATRIC_MEDICATIONS, PAEDIATRIC_MEDICATION_METADATA } from './paediatricMedications.js';

// --- COUNSELING DATA ---
import { COUNSELING_MEDICATIONS, COUNSELING_METADATA } from './counselingData.js';
import ABX_DATA from './abxData.json';
import FRANK_SHANN_DATA from './frankShannData.json';

// --- NAG DATA STRUCTURE & URLs ---
const NAG_BASE = "https://sites.google.com/moh.gov.my/nag/contents";
const NAG_APP_BASE = "https://sites.google.com/moh.gov.my/nag/appendices";

const NAG_SECTIONS = {
    adult: [
        { id: "A1", title: "Cardiovascular Infections", url: `${NAG_BASE}/section-a-adult/a1-cardiovascular-infections` },
        { id: "A2", title: "Central Nervous Infections", url: `${NAG_BASE}/section-a-adult/a2-central-nervous-infections` },
        { id: "A3", title: "Chemoprophylaxis", url: `${NAG_BASE}/section-a-adult/a3-chemoprophylaxis` },
        { id: "A4", title: "Gastrointestinal Infections", url: `${NAG_BASE}/section-a-adult/a4-gastrointestinal-infections` },
        { id: "A5", title: "Immunocompromised Patients", url: `${NAG_BASE}/section-a-adult/a5-infections-in-immunocompromised-patients` },
        { id: "A6", title: "Obs & Gynae Infections", url: `${NAG_BASE}/section-a-adult/a6-obstetrics-gyneacological-infections` },
        { id: "A7", title: "Ocular Infections", url: `${NAG_BASE}/section-a-adult/a7-ocular-infections` },
        { id: "A8", title: "Oral / Dental Infections", url: `${NAG_BASE}/section-a-adult/a8-oral-dental-infections` },
        { id: "A9", title: "Orthopaedic Infections", url: `${NAG_BASE}/section-a-adult/a9-orthopaedic-infections` },
        { id: "A10", title: "ORL Infections", url: `${NAG_BASE}/section-a-adult/a10-otorhinolaryngology-infections` },
        { id: "A11", title: "Respiratory Infections", url: `${NAG_BASE}/section-a-adult/a11-respiratory-infections` },
        { id: "A12", title: "Sepsis", url: `${NAG_BASE}/section-a-adult/a12-sepsis` },
        { id: "A13", title: "STIs", url: `${NAG_BASE}/section-a-adult/a13-sexually-transmitted-infections` },
        { id: "A14", title: "Skin & Soft Tissue", url: `${NAG_BASE}/section-a-adult/a14-skin-soft-tissue-infections` },
        { id: "A15", title: "Trauma Related", url: `${NAG_BASE}/section-a-adult/a15-trauma-related-infections` },
        { id: "A16", title: "Tropical Infections", url: `${NAG_BASE}/section-a-adult/a16-tropical-infections` },
        { id: "A17", title: "Urinary Tract Infections", url: `${NAG_BASE}/section-a-adult/a17-urinary-tract-infections` },
    ],
    paeds: [
        { id: "B1", title: "Cardiovascular", url: `${NAG_BASE}/section-b-paediatrics/b1-cardiovascular-infections` },
        { id: "B2", title: "CNS Infections", url: `${NAG_BASE}/section-b-paediatrics/b2-central-nervous-infections` },
        { id: "B6", title: "Neonatal Infections", url: `${NAG_BASE}/section-b-paediatrics/b6-neonatal-infections` },
        { id: "B10", title: "Respiratory Infections", url: `${NAG_BASE}/section-b-paediatrics/b10-respiratory-infections` },
        { id: "B13", title: "Urinary Tract Infections", url: `${NAG_BASE}/section-b-paediatrics/b13-urinary-tract-infections` },
        { id: "B14", title: "Vascular Infections", url: `${NAG_BASE}/section-b-paediatrics/b14-vascular-infections` }
    ],
    primary: [
        { id: "C1", title: "Acute Bronchitis/Pneumonia", url: `${NAG_BASE}/section-c-clinical-pathways-in-primary-care/c1-acute-bronchitis-and-pneumonia` },
        { id: "C2", title: "Acute Otitis Media", url: `${NAG_BASE}/section-c-clinical-pathways-in-primary-care/c2-acute-otitis-media` },
        { id: "C3", title: "Acute Pharyngitis", url: `${NAG_BASE}/section-c-clinical-pathways-in-primary-care/c3-acute-pharyngitis` },
        { id: "C4", title: "Acute Rhinosinusitis", url: `${NAG_BASE}/section-c-clinical-pathways-in-primary-care/c4-acute-rhinosinusitis` },
        { id: "C5", title: "Acute Gastroenteritis", url: `${NAG_BASE}/section-c-clinical-pathways-in-primary-care/c5-acute-gastroenteritis` },
        { id: "C7", title: "UTI (Non-Pregnancy)", url: `${NAG_BASE}/section-c-clinical-pathways-in-primary-care/c7-urinary-tract-infection-in-non-pregnancy` },
    ]
};

// --- COMPONENTS ---

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100 border border-slate-200 dark:border-slate-700">
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors z-10 text-slate-500 dark:text-slate-400"
                    >
                        <X size={20} />
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};

const Badge = ({ children, type = "default" }) => {
    const styles = {
        default: "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200",
        highAlert: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800",
        category: "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-800",
        form: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800",
        prescriber: "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-800"
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${styles[type]}`}>
            {children}
        </span>
    );
};

const DetailRow = ({ icon: Icon, label, value, warning = false }) => (
    <div className="flex items-start space-x-4 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0 group hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg transition-colors">
        <div className={`p-2.5 rounded-xl shadow-sm ${warning
            ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
            : 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'}`}>
            <Icon size={20} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{label}</h4>
            <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line break-words font-medium">{value || "N/A"}</p>
        </div>
    </div>
);

// --- NAG VIEW COMPONENT ---
const NAGView = () => {
    const openLink = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 md:space-y-8">
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-3">
                            <Shield size={32} className="text-teal-400" />
                            <span>National Antimicrobial Guideline</span>
                        </h2>
                        <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                            Official Ministry of Health Malaysia guidelines for antibiotic prescribing.
                            Access the latest protocols for Adult, Paediatric, and Primary Care, tailored for Hospital Seri Manjung.
                        </p>
                    </div>
                    <button
                        onClick={() => openLink("https://sites.google.com/moh.gov.my/nag/home")}
                        className="w-full md:w-auto bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-teal-900/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        Open Official Site <ExternalLink size={18} />
                    </button>
                </div>
            </div>

            {/* Quick Categories */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {/* Adult Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
                            <UserCheck size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Section A: Adult</h3>
                    </div>
                    <div className="p-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-600">
                        {NAG_SECTIONS.adult.map(section => (
                            <button
                                key={section.id}
                                onClick={() => openLink(section.url)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between group/item transition-colors min-h-[44px]"
                            >
                                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-teal-700 dark:group-hover/item:text-teal-400 font-medium">{section.title}</span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">{section.id}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Paediatrics Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Baby size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Section B: Paediatrics</h3>
                    </div>
                    <div className="p-2">
                        {NAG_SECTIONS.paeds.map(section => (
                            <button
                                key={section.id}
                                onClick={() => openLink(section.url)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between group/item transition-colors min-h-[44px]"
                            >
                                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-blue-700 dark:group-hover/item:text-blue-400 font-medium">{section.title}</span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">{section.id}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Primary Care Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                        <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
                            <StethIcon size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Section C: Primary Care</h3>
                    </div>
                    <div className="p-2">
                        {NAG_SECTIONS.primary.map(section => (
                            <button
                                key={section.id}
                                onClick={() => openLink(section.url)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between group/item transition-colors min-h-[44px]"
                            >
                                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover/item:text-violet-700 dark:group-hover/item:text-violet-400 font-medium">{section.title}</span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">{section.id}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Tools */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div
                    onClick={() => openLink(`${NAG_APP_BASE}/appendix-2-antibiotic-dosages-in-patients-with-impaired-renal-function`)}
                    className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-100 dark:border-amber-800 cursor-pointer hover:shadow-md transition-all group"
                >
                    <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                        <Activity size={18} /> Renal Dosage Adjustment
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                        Guidance on adjusting antibiotic doses for patients with impaired renal function (CrCl based).
                    </p>
                </div>

                <div
                    onClick={() => openLink(`${NAG_APP_BASE}/appendix-4-antibiotic-in-pregnancy-lactation`)}
                    className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-5 border border-rose-100 dark:border-rose-800 cursor-pointer hover:shadow-md transition-all group"
                >
                    <h4 className="font-bold text-rose-800 dark:text-rose-400 mb-2 flex items-center gap-2">
                        <Baby size={18} /> Pregnancy & Lactation
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-sm text-rose-700 dark:text-rose-300">
                        Safety profiles and category references for antimicrobial use during pregnancy.
                    </p>
                </div>
            </div>
        </div>
    );
};
// --- ABX REGIME VIEW COMPONENT ---
const ABXRegimeView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAntibiotic, setSelectedAntibiotic] = useState(null);
    const antibiotics = ABX_DATA.antibiotics;

    const filteredAntibiotics = useMemo(() => {
        if (!searchTerm) return antibiotics;
        const searchLower = searchTerm.toLowerCase();
        return antibiotics.filter(abx =>
            abx.name.toLowerCase().includes(searchLower) ||
            abx.category.toLowerCase().includes(searchLower) ||
            abx.route.toLowerCase().includes(searchLower)
        );
    }, [searchTerm, antibiotics]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 pb-4 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <Activity size={28} className="text-emerald-600 dark:text-emerald-400" />
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">ABX Regime HSM 2017</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Antibiotic Renal Dosing Adjustments</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search antibiotic name, category, or route..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-600 outline-none text-slate-800 dark:text-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                    Showing {filteredAntibiotics.length} of {antibiotics.length} antibiotics
                </div>
            </div>

            {/* Results */}
            <div className="space-y-3">
                {filteredAntibiotics.map(abx => (
                    <div
                        key={abx.id}
                        onClick={() => setSelectedAntibiotic(abx)}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{abx.name}</h3>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">
                                        {abx.route}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                    <strong>Usual Dose:</strong> {abx.usualDose}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-500">{abx.category}</p>
                            </div>
                            <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
                        </div>
                    </div>
                ))}

                {filteredAntibiotics.length === 0 && (
                    <div className="text-center py-12">
                        <Search className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                        <p className="text-slate-500 dark:text-slate-400">No antibiotics found</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedAntibiotic && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAntibiotic(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-white">{selectedAntibiotic.name}</h3>
                                        <span className="px-2 py-1 rounded-lg bg-white/20 text-white text-xs font-bold">
                                            {selectedAntibiotic.route}
                                        </span>
                                    </div>
                                    <p className="text-emerald-100 text-sm">{selectedAntibiotic.category}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedAntibiotic(null)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Usual Dose */}
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                                    <Info size={18} className="text-emerald-600" />
                                    Usual Dose
                                </h4>
                                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                    {selectedAntibiotic.usualDose}
                                </p>
                            </div>

                            {/* Renal Dosing Table */}
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                                    <Activity size={18} className="text-emerald-600" />
                                    Renal Dosing Adjustments
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-100 dark:bg-slate-700/50">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-bold text-slate-700 dark:text-slate-300">CrCl (ml/min)</th>
                                                <th className="px-4 py-2 text-left font-bold text-slate-700 dark:text-slate-300">Dosage Adjustment</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {selectedAntibiotic.renalDosing.map((dosing, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{dosing.crcl}</td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{dosing.adjustment}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedAntibiotic.notes && (
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h5 className="font-bold text-amber-800 dark:text-amber-400 text-sm mb-1">Important Notes</h5>
                                            <p className="text-xs text-amber-700 dark:text-amber-300">{selectedAntibiotic.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- DILUTION VIEW COMPONENT ---
const DilutionView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDrug, setSelectedDrug] = useState(null);

    const filteredDrugs = useMemo(() => {
        if (!searchTerm) return DILUTION_DATA;
        const searchLower = searchTerm.toLowerCase();
        return DILUTION_DATA.filter(drug =>
            drug.genericName.toLowerCase().includes(searchLower) ||
            drug.brandName.toLowerCase().includes(searchLower) ||
            drug.category.toLowerCase().includes(searchLower)
        );
    }, [searchTerm]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Sticky Search Header */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md -mx-4 px-4 pb-4 mb-6">
                {/* Compact Header */}
                <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 mb-4">
                    <div className="flex items-center gap-3">
                        <Beaker size={24} className="text-amber-600 dark:text-amber-400" />
                        <div>
                            <h2 className="font-bold text-slate-800 dark:text-slate-100">Dilution Protocol</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{DILUTION_DATA.length} Injectable Drugs</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by drug name or category..."
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-900/50 rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none text-base font-medium shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Drug Grid */}
            {filteredDrugs.length === 0 ? (
                <div className="text-center py-12 md:py-20">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-400 dark:text-slate-500" size={32} />
                    </div>
                    <h3 className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-300">No drugs found</h3>
                    <p className="text-slate-400 dark:text-slate-500">Try adjusting your search</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {filteredDrugs.map(drug => (
                        <div
                            key={drug.id}
                            onClick={() => setSelectedDrug(drug)}
                            className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-amber-200 dark:hover:border-amber-700 transition-all cursor-pointer group relative"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Syringe size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                        <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
                                            {drug.genericName}
                                        </h3>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{drug.brandName}</p>
                                    {drug.strength && (
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Strength: {drug.strength}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                <Badge type="default">{drug.category}</Badge>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                    <Droplets size={14} />
                                    <span>{drug.diluents.length} diluent(s)</span>
                                </div>
                                <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                                    View Protocol <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <Modal isOpen={!!selectedDrug} onClose={() => setSelectedDrug(null)}>
                {selectedDrug && (
                    <div className="bg-white dark:bg-slate-800 w-full">
                        {/* Modal Header */}
                        <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20">
                            <div className="flex items-start gap-3 mb-2">
                                <Syringe size={24} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                        {selectedDrug.genericName}
                                    </h2>
                                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">{selectedDrug.brandName}</p>
                                    {selectedDrug.strength && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Strength: {selectedDrug.strength}</p>
                                    )}
                                </div>
                            </div>
                            <Badge type="default">{selectedDrug.category}</Badge>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 md:p-6 space-y-1">
                            {selectedDrug.reconstitution && (
                                <DetailRow
                                    icon={Beaker}
                                    label="Reconstitution"
                                    value={selectedDrug.reconstitution}
                                />
                            )}
                            {selectedDrug.furtherDilution && (
                                <DetailRow
                                    icon={Droplets}
                                    label="Further Dilution"
                                    value={selectedDrug.furtherDilution}
                                />
                            )}
                            {selectedDrug.diluents && selectedDrug.diluents.length > 0 && (
                                <div className="flex items-start space-x-4 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0 group hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg transition-colors">
                                    <div className="p-2.5 rounded-xl shadow-sm bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                                        <Droplets size={20} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Diluents</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDrug.diluents.map((diluent, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 rounded-md text-xs font-bold">
                                                    {diluent}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {selectedDrug.administration && (
                                <DetailRow
                                    icon={Syringe}
                                    label="Administration"
                                    value={selectedDrug.administration}
                                />
                            )}
                            {selectedDrug.storage && (
                                <DetailRow
                                    icon={Clock}
                                    label="Storage & Stability"
                                    value={selectedDrug.storage}
                                    warning={true}
                                />
                            )}
                            {selectedDrug.remarks && (
                                <DetailRow
                                    icon={AlertTriangle}
                                    label="Important Remarks"
                                    value={selectedDrug.remarks}
                                    warning={true}
                                />
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 md:px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-start gap-2">
                                <FileText size={16} className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    <strong>Source:</strong> {DILUTION_METADATA.author} | Always refer to current product insert for your specific brand.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// --- PAEDIATRIC VIEW COMPONENT ---
const PaediatricProtocolView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredMedications = useMemo(() => {
        let meds = PAEDIATRIC_MEDICATIONS;

        // Filter by category
        if (selectedCategory !== "All") {
            meds = meds.filter(med => med.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            meds = meds.filter(med =>
                med.name.toLowerCase().includes(searchLower) ||
                med.category.toLowerCase().includes(searchLower) ||
                med.indications.some(ind => ind.toLowerCase().includes(searchLower))
            );
        }

        return meds;
    }, [searchTerm, selectedCategory]);

    const categories = useMemo(() => {
        const cats = [...new Set(PAEDIATRIC_MEDICATIONS.map(med => med.category))];
        return ["All", ...cats.sort()];
    }, []);

    const openPDF = () => {
        window.open('/Paediatric Protocols 5th Edition PDF_compressed.pdf', '_blank');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Sticky Search Header */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md -mx-4 px-4 pb-4 mb-6">
                {/* Compact Header */}
                <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 mb-4">
                    <div className="flex items-center gap-3">
                        <Baby size={24} className="text-purple-600 dark:text-purple-400" />
                        <div>
                            <h2 className="font-bold text-slate-800 dark:text-slate-100">Paediatric Medications</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{PAEDIATRIC_MEDICATIONS.length} Medications</p>
                        </div>
                    </div>
                    <button onClick={openPDF} className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                        <FileText size={14} /> View PDF
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search medications by name or indication..."
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-900/50 rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none text-base font-medium shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === category
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{PAEDIATRIC_MEDICATION_METADATA.totalMedications}</p>
                    <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Medications</p>
                </div>
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 border border-pink-100 dark:border-pink-800">
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{categories.length - 1}</p>
                    <p className="text-xs text-pink-700 dark:text-pink-300 font-medium">Categories</p>
                </div>
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border border-violet-100 dark:border-violet-800 col-span-2 md:col-span-1">
                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">2024</p>
                    <p className="text-xs text-violet-700 dark:text-violet-300 font-medium">5th Edition</p>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-purple-800 dark:text-purple-400 mb-1 text-sm">Important Notice</h4>
                        <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                            {PAEDIATRIC_MEDICATION_METADATA.disclaimer}
                        </p>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Showing {filteredMedications.length} of {PAEDIATRIC_MEDICATIONS.length} medications
                </span>
            </div>

            {/* Medications Grid */}
            {filteredMedications.length === 0 ? (
                <div className="text-center py-12 md:py-20">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-400 dark:text-slate-500" size={32} />
                    </div>
                    <h3 className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-300">No medications found</h3>
                    <p className="text-slate-400 dark:text-slate-500">Try adjusting your search or category filter</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {filteredMedications.map(med => (
                        <div
                            key={med.id}
                            onClick={() => setSelectedMedication(med)}
                            className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-700 transition-all cursor-pointer group relative"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Syringe size={18} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                        <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                                            {med.name}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                        {med.category}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {med.indications.slice(0, 3).map((indication, idx) => (
                                            <span key={idx} className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                                                {indication}
                                            </span>
                                        ))}
                                        {med.indications.length > 3 && (
                                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                                +{med.indications.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                    <FileText size={14} />
                                    <span>View Dosing</span>
                                </div>
                                <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                                    Details <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Medication Detail Modal */}
            <Modal isOpen={!!selectedMedication} onClose={() => setSelectedMedication(null)}>
                {selectedMedication && (
                    <div className="bg-white dark:bg-slate-800 w-full">
                        {/* Modal Header */}
                        <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 dark:border-slate-700 bg-purple-50 dark:bg-purple-900/20">
                            <div className="flex items-start gap-3 mb-2">
                                <Syringe size={24} className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                        {selectedMedication.name}
                                    </h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedMedication.category}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedMedication.indications.map((indication, idx) => (
                                    <Badge key={idx} type="default">{indication}</Badge>
                                ))}
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 md:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* Dosing Information */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Dosing Information</h3>
                                <div className="space-y-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                    {Object.entries(selectedMedication.dosing).map(([key, value]) => (
                                        <div key={key} className="border-b border-slate-200 dark:border-slate-600 last:border-0 pb-3 last:pb-0">
                                            <h4 className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-2 capitalize">
                                                {key.replace(/_/g, ' ')}
                                            </h4>
                                            {typeof value === 'object' ? (
                                                <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                                                    {Object.entries(value).map(([subKey, subValue]) => (
                                                        <p key={subKey} className="leading-relaxed">
                                                            <strong className="text-slate-900 dark:text-slate-100">{subKey.replace(/_/g, ' ')}:</strong> {subValue}
                                                        </p>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-700 dark:text-slate-300">{value}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Routes */}
                            {selectedMedication.route && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Routes of Administration</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMedication.route.map((route, idx) => (
                                            <span key={idx} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                                                {route}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contraindications */}
                            {selectedMedication.contraindications && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Contraindications</h3>
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                        <ul className="text-xs text-red-800 dark:text-red-300 space-y-1">
                                            {selectedMedication.contraindications.map((contra, idx) => (
                                                <li key={idx}>• {contra}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Monitoring */}
                            {selectedMedication.monitoring && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Monitoring</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMedication.monitoring.map((item, idx) => (
                                            <span key={idx} className="text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Side Effects */}
                            {selectedMedication.sideEffects && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Common Side Effects</h3>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                        <ul className="text-xs text-yellow-800 dark:text-yellow-300 space-y-1">
                                            {selectedMedication.sideEffects.map((effect, idx) => (
                                                <li key={idx}>• {effect}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Additional Notes */}
                            {selectedMedication.notes && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Additional Notes</h3>
                                    <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                        {selectedMedication.notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 md:px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex gap-3">
                            <button
                                onClick={openPDF}
                                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <FileText size={16} />
                                View Full Protocol
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// --- FRANK SHANN VIEW COMPONENT ---
const FrankShannView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDrug, setSelectedDrug] = useState(null);

    const filteredDrugs = useMemo(() => {
        if (!searchTerm) return FRANK_SHANN_DATA;
        const lower = searchTerm.toLowerCase();
        return FRANK_SHANN_DATA.filter(d =>
            d.name.toLowerCase().includes(lower) ||
            d.dosage.toLowerCase().includes(lower)
        );
    }, [searchTerm]);

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-700 dark:to-rose-700 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-3">
                            <Stethoscope size={32} className="text-pink-200" />
                            <span>Frank Shann Drug Doses</span>
                        </h2>
                        <p className="text-pink-50 text-sm md:text-base max-w-2xl leading-relaxed mb-2">
                            17th Edition (2017) - Paediatric Drug Doses
                        </p>
                        <p className="text-pink-100 text-xs">
                            <strong>Source:</strong> Frank Shann 17th Ed.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <input
                    type="text"
                    placeholder="Search Frank Shann formulary..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-700 focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-500/10 dark:focus:ring-pink-900/50 rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none text-base font-medium shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Showing {filteredDrugs.length} entries
                </span>
            </div>

            {filteredDrugs.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-400 dark:text-slate-500" size={32} />
                    </div>
                    <p className="text-slate-400 dark:text-slate-500">No results found</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-1">
                    {filteredDrugs.slice(0, 100).map(drug => (
                        <div
                            key={drug.id}
                            onClick={() => setSelectedDrug(drug)}
                            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-pink-300 dark:hover:border-pink-700 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{drug.name}</h3>
                                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors" />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 font-mono bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">{drug.dosage}</p>
                        </div>
                    ))}
                    {filteredDrugs.length > 100 && (
                        <div className="text-center py-4 text-slate-400 dark:text-slate-500 text-sm italic">
                            Showing first 100 results. Refine search to see more.
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={!!selectedDrug} onClose={() => setSelectedDrug(null)}>
                {selectedDrug && (
                    <div className="bg-white dark:bg-slate-800 w-full">
                        <div className="px-5 md:px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-pink-50 dark:bg-pink-900/20">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedDrug.name}</h2>
                            <p className="text-xs text-pink-600 dark:text-pink-400 font-mono mt-1">{selectedDrug.id}</p>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-100 dark:border-slate-600">
                                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <FileText size={16} /> Dosage & Information
                                </h3>
                                <p className="text-base text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-medium">
                                    {selectedDrug.dosage}
                                </p>
                            </div>
                        </div>
                        <div className="px-5 md:px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                <strong>Source:</strong> Frank Shann 17th Edition. Always verify with clinical judgment.
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// --- MAIN PAEDIATRIC VIEW WRAPPER ---
const PaediatricView = () => {
    const [activeTab, setActiveTab] = useState('frankshann');

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 md:space-y-8">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab('frankshann')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'frankshann' ? 'bg-white dark:bg-slate-700 shadow-sm text-pink-600 dark:text-pink-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <Stethoscope size={16} /> Frank Shann
                </button>
                <button
                    onClick={() => setActiveTab('protocol')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'protocol' ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <Baby size={16} /> Paediatric Protocol
                </button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                {activeTab === 'frankshann' ? <FrankShannView /> : <PaediatricProtocolView />}
            </div>
        </div>
    );
};

// --- COUNSELING VIEW COMPONENT ---
const CounselingView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState("All");

    const filteredMedications = useMemo(() => {
        let meds = COUNSELING_MEDICATIONS;
        if (selectedGroup !== "All") {
            meds = meds.filter(med => med.pharmacologicalGroup === selectedGroup);
        }
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            meds = meds.filter(med =>
                med.name.toLowerCase().includes(searchLower) ||
                med.pharmacologicalGroup.toLowerCase().includes(searchLower) ||
                med.indication.toLowerCase().includes(searchLower)
            );
        }
        return meds;
    }, [searchTerm, selectedGroup]);

    const pharmacologicalGroups = useMemo(() => {
        const groups = [...new Set(COUNSELING_MEDICATIONS.map(med => med.pharmacologicalGroup))];
        return ["All", ...groups.sort()];
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Sticky Search Header */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md -mx-4 px-4 pb-4 mb-6">
                {/* Compact Header */}
                <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 mb-4">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={24} className="text-emerald-600 dark:text-emerald-400" />
                        <div>
                            <h2 className="font-bold text-slate-800 dark:text-slate-100">Counseling Points</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{COUNSELING_MEDICATIONS.length} Medications</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search medications..."
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-900/50 rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none text-base font-medium shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            {
                filteredMedications.length === 0 ? (
                    <div className="text-center py-12 md:py-20">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4">
                            <Search className="text-slate-400 dark:text-slate-500" size={32} />
                        </div>
                        <h3 className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-300">No medications found</h3>
                        <p className="text-slate-400 dark:text-slate-500">Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                        {filteredMedications.map(med => (
                            <div key={med.id} onClick={() => setSelectedMedication(med)} className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700 transition-all cursor-pointer group relative">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Pill size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">{med.name}</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{med.pharmacologicalGroup}</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{med.indication}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                        <MessageSquare size={14} />
                                        <span>Counseling Info</span>
                                    </div>
                                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-bold group-hover:translate-x-1 transition-transform">Details <ChevronRight size={16} /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
            <Modal isOpen={!!selectedMedication} onClose={() => setSelectedMedication(null)}>
                {selectedMedication && (
                    <div className="bg-white dark:bg-slate-800 w-full">
                        <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-900/20">
                            <div className="flex items-start gap-3 mb-2">
                                <Pill size={24} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">{selectedMedication.name}</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedMedication.pharmacologicalGroup}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Activity size={16} /> Indication</h3>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{selectedMedication.indication}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Clock size={16} /> Dosage</h3>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{selectedMedication.dosage}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Syringe size={16} /> Method of Administration</h3>
                                <div className="space-y-2">
                                    {selectedMedication.methodOfAdministration.split(/(?=\d+\.\s)/).filter(p => p.trim()).map((paragraph, idx) => (
                                        <p key={idx} className="text-sm text-slate-700 dark:text-slate-300">{paragraph.trim()}</p>
                                    ))}
                                </div>
                            </div>
                            {selectedMedication.specialConsiderations && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <AlertTriangle size={18} className="text-amber-500" />
                                        Special Considerations
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedMedication.specialConsiderations.pregnancy && (
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Pregnancy</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 pl-4">{selectedMedication.specialConsiderations.pregnancy}</p>
                                            </div>
                                        )}
                                        {selectedMedication.specialConsiderations.breastfeeding && (
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Breastfeeding</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 pl-4">{selectedMedication.specialConsiderations.breastfeeding}</p>
                                            </div>
                                        )}
                                        {selectedMedication.specialConsiderations.elderly && (
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Elderly</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 pl-4">{selectedMedication.specialConsiderations.elderly}</p>
                                            </div>
                                        )}
                                        {selectedMedication.specialConsiderations.paediatric && (
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Paediatric</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 pl-4">{selectedMedication.specialConsiderations.paediatric}</p>
                                            </div>
                                        )}
                                        {selectedMedication.specialConsiderations.fasting && (
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Fasting</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 pl-4">{selectedMedication.specialConsiderations.fasting}</p>
                                            </div>
                                        )}
                                        {selectedMedication.specialConsiderations.hepaticImpairment && (
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Hepatic Impairment</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 pl-4">{selectedMedication.specialConsiderations.hepaticImpairment}</p>
                                            </div>
                                        )}
                                        {selectedMedication.specialConsiderations.renalImpairment && (
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Renal Impairment</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 pl-4">{selectedMedication.specialConsiderations.renalImpairment}</p>
                                            </div>
                                        )}
                                        {selectedMedication.specialConsiderations.other && selectedMedication.specialConsiderations.other.length > 0 && (
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Other</h4>
                                                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 pl-4 space-y-1">
                                                    {selectedMedication.specialConsiderations.other.map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {selectedMedication.sideEffects && selectedMedication.sideEffects.length > 0 && (
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                    <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2"><AlertTriangle size={16} /> Side Effects & Management</h3>
                                    <ul className="space-y-2">
                                        {selectedMedication.sideEffects.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                                                <span className="text-sm text-amber-900 dark:text-amber-300">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {selectedMedication.others && (
                                <div className="space-y-3">
                                    {selectedMedication.others.contraindications && (<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"><h4 className="text-xs font-bold text-red-800 dark:text-red-400 mb-1">Contraindications</h4><p className="text-xs text-red-700 dark:text-red-300">{selectedMedication.others.contraindications}</p></div>)}
                                    {selectedMedication.others.drugInteractions && (<div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3"><h4 className="text-xs font-bold text-orange-800 dark:text-orange-400 mb-1">Drug Interactions</h4><p className="text-xs text-orange-700 dark:text-orange-300">{selectedMedication.others.drugInteractions}</p></div>)}
                                    {selectedMedication.others.monitoring && (<div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3"><h4 className="text-xs font-bold text-purple-800 dark:text-purple-400 mb-1">Monitoring Parameters</h4><p className="text-xs text-purple-700 dark:text-purple-300">{selectedMedication.others.monitoring}</p></div>)}
                                    {selectedMedication.others.counselingPoints && (
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                                            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-2"><MessageSquare size={16} /> Patient Counseling Points</h4>
                                            <ul className="text-xs text-emerald-700 dark:text-emerald-300 space-y-1.5">
                                                {selectedMedication.others.counselingPoints.map((point, idx) => (<li key={idx} className="flex items-start gap-2"><span className="text-emerald-500 dark:text-emerald-400 font-bold">•</span><span>{point}</span></li>))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="px-5 md:px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-start gap-2">
                                <FileText size={16} className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"><strong>Source:</strong> {COUNSELING_METADATA.title} | Updated: {COUNSELING_METADATA.lastUpdated}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div >
    );
};



// --- HOOKS ---
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}


export default function FormularyApp() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [visibleCount, setVisibleCount] = useState(20);
    const [favorites, setFavorites] = useState([]);
    const [selectedDrug, setSelectedDrug] = useState(null);
    const [view, setView] = useState('list');
    const [appMode, setAppMode] = useState('formulary');
    const [darkMode, setDarkMode] = useState(false);
    const formularyData = FORMULARY_DATA;

    // Load dark mode preference
    // Listen for system dark mode preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => setDarkMode(e.matches);

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Apply dark mode class to document
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Load favorites
    useEffect(() => {
        const saved = localStorage.getItem('formulary_favorites');
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse favorites");
            }
        }
    }, []);




    useEffect(() => {
        localStorage.setItem('formulary_favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Reset visible count when search changes
    useEffect(() => {
        setVisibleCount(20);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [debouncedSearchTerm, view, appMode]);

    const loadMore = () => {
        setVisibleCount(prev => prev + 20);
    };

    const toggleFavorite = (e, drugId) => {
        e.stopPropagation();
        if (favorites.includes(drugId)) {
            setFavorites(prev => prev.filter(id => id !== drugId));
        } else {
            setFavorites(prev => [...prev, drugId]);
        }
    };



    const filteredDrugs = useMemo(() => {
        let data = formularyData;

        if (view === 'favorites') {
            data = data.filter(d => favorites.includes(d.id));
        }

        return data.filter(drug => {
            const searchLower = debouncedSearchTerm.toLowerCase();
            const matchesSearch =
                (drug.genericName && drug.genericName.toLowerCase().includes(searchLower)) ||
                (drug.brandName && drug.brandName.toLowerCase().includes(searchLower));

            return matchesSearch;
        });
    }, [debouncedSearchTerm, favorites, view, formularyData]);



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans text-gray-900 dark:text-gray-100 transition-colors">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 shadow-sm transition-all">
                <div className="max-w-4xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-between mb-2 gap-3">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="bg-white p-0.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden shrink-0">
                                <img src="/hsm-logo.jpg" alt="HSM Logo" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h1 className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none tracking-tight">
                                    HOSPITAL SERI MANJUNG
                                </h1>
                                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5 tracking-wide uppercase">
                                    Official Formulary & Guidelines
                                </p>
                                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mt-0.5">
                                    Updated: 2 October 2025
                                </p>
                            </div>
                        </div>

                        {/* Tools & Dark Mode */}
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Authorized Personnel Only</span>
                            </div>


                        </div>
                    </div>

                    {/* SHOW SEARCH ONLY IN FORMULARY MODE */}
                    {appMode === 'formulary' && (
                        <div className="relative mb-1">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-teal-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by generic or brand name..."
                                    className="w-full pl-10 pr-12 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 dark:focus:ring-teal-900/50 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none text-sm md:text-base font-medium shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {/* Favorites Toggle Integrated in Search Bar */}
                                <button
                                    onClick={() => setView(view === 'list' ? 'favorites' : 'list')}
                                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-all ${view === 'favorites'
                                        ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400'
                                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                    title="Toggle Favorites"
                                >
                                    <Heart size={18} fill={view === 'favorites' ? "currentColor" : "none"} />
                                </button>
                            </div>
                            {/* Mobile Quick Links */}
                            <div className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                <button
                                    onClick={() => setAppMode('abx')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full flex-shrink-0"
                                >
                                    <Activity size={13} className="text-amber-600 dark:text-amber-400" />
                                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Renal Dosing</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="pb-20">
                {appMode === 'nag' ? (
                    <NAGView />
                ) : appMode === 'abx' ? (
                    <ABXRegimeView />
                ) : appMode === 'dilution' ? (
                    <DilutionView />
                ) : appMode === 'paediatric' ? (
                    <PaediatricView />
                ) : appMode === 'counseling' ? (
                    <CounselingView />
                ) : (
                    <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
                        {/* Renal Dosing Card */}


                        {/* Results Count */}
                        {formularyData.length > 0 && (
                            <div className="flex items-center justify-between mb-4 px-2">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                    Showing {filteredDrugs.length} of {formularyData.length} medications
                                </span>
                            </div>
                        )}

                        {filteredDrugs.length === 0 ? (
                            <div className="text-center py-12 md:py-20">
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4">
                                    <Search className="text-slate-400 dark:text-slate-500" size={32} />
                                </div>
                                <h3 className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-300">No medications found</h3>
                                <p className="text-slate-400 dark:text-slate-500">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                                {filteredDrugs.slice(0, visibleCount).map(drug => (
                                    <div
                                        key={drug.id}
                                        onClick={() => setSelectedDrug(drug)}
                                        className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all cursor-pointer group relative"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1 pr-2 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight break-words">
                                                        {drug.genericName}
                                                    </h3>
                                                    {drug.highAlert && (
                                                        <AlertTriangle size={16} className="text-rose-500 dark:text-rose-400 flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">{drug.brandName}</p>
                                            </div>
                                            <button
                                                onClick={(e) => toggleFavorite(e, drug.id)}
                                                className={`p-2 rounded-full transition-all flex-shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center ${favorites.includes(drug.id)
                                                    ? 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30'
                                                    : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                            >
                                                <Heart size={20} fill={favorites.includes(drug.id) ? "currentColor" : "none"} />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Badge type="category">{drug.category}</Badge>
                                            {drug.notes && drug.notes.toLowerCase().includes('kuota') && (
                                                <Badge type="highAlert">KUOTA</Badge>
                                            )}
                                            {drug.notes && (() => {
                                                // Extract departments from notes (e.g., "Dept: Pembedahan, Perubatan")
                                                const deptMatch = drug.notes.match(/Dept:\s*([^\)\n]+)/i);
                                                if (deptMatch) {
                                                    const depts = deptMatch[1]
                                                        .split(/[,;]/)  // Split by comma or semicolon
                                                        .map(d => d.trim())
                                                        .filter(d => d.length > 0);  // Filter out empty strings
                                                    return depts.map((dept, idx) => (
                                                        <Badge key={idx} type="prescriber">{dept}</Badge>
                                                    ));
                                                }
                                                return null;
                                            })()}
                                            {drug.prescriberCat && drug.prescriberCat !== "N/A" && (
                                                <Badge type="prescriber">Cat: {drug.prescriberCat}</Badge>
                                            )}
                                            {drug.highAlert && <Badge type="highAlert">High Alert</Badge>}
                                        </div>

                                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
                                            <p className="flex items-start gap-2">
                                                <Activity size={14} className="text-slate-400 dark:text-slate-500 mt-1 flex-shrink-0" />
                                                <span className="line-clamp-2 font-medium">{drug.indications}</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                                                {drug.price && drug.price !== "N/A" ? `RM ${drug.price}` : "Price N/A"}
                                            </span>
                                            <div className="flex items-center text-teal-600 dark:text-teal-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                                                Details <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Load More Button */}
                        {filteredDrugs.length > visibleCount && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={loadMore}
                                    className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 px-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all transform hover:-translate-y-0.5"
                                >
                                    Load More Results ({filteredDrugs.length - visibleCount} remaining)
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Drug Detail Modal */}
            <Modal isOpen={!!selectedDrug} onClose={() => setSelectedDrug(null)}>
                {selectedDrug && (
                    <div className="bg-white dark:bg-slate-800 w-full">
                        {/* Modal Header */}
                        <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 dark:border-slate-700 flex items-start justify-between bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex-1 pr-4 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight break-words">{selectedDrug.genericName}</h2>
                                    {selectedDrug.highAlert && (
                                        <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                                            <AlertTriangle size={12} /> HIGH ALERT
                                        </span>
                                    )}
                                </div>
                                <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium">{selectedDrug.brandName}</p>
                            </div>
                            <button
                                onClick={(e) => toggleFavorite(e, selectedDrug.id)}
                                className={`p-2 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center ${favorites.includes(selectedDrug.id)
                                    ? 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30'
                                    : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                <Heart size={24} fill={favorites.includes(selectedDrug.id) ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 md:p-6">
                            {/* Quick Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <Badge type="category">{selectedDrug.category}</Badge>
                                {selectedDrug.prescriberCat && selectedDrug.prescriberCat !== "N/A" && (
                                    <Badge type="prescriber">Prescriber: {selectedDrug.prescriberCat}</Badge>
                                )}
                                {selectedDrug.forms.map((form, i) => (
                                    <Badge key={i} type="form">{form}</Badge>
                                ))}
                            </div>

                            {/* Detailed Information Grid */}
                            <div className="space-y-1">
                                <DetailRow
                                    icon={Activity}
                                    label="Indications"
                                    value={selectedDrug.indications}
                                />
                                <DetailRow
                                    icon={Clock}
                                    label="Dosing Regimen"
                                    value={selectedDrug.dosing}
                                />
                                <DetailRow
                                    icon={ShieldAlert}
                                    label="Renal Adjustments"
                                    value={selectedDrug.renalDose}
                                    warning={true}
                                />

                                <DetailRow
                                    icon={Baby}
                                    label="Pregnancy Category"
                                    value={selectedDrug.pregnancy}
                                />
                                <DetailRow
                                    icon={Info}
                                    label="Notes & Remarks"
                                    value={selectedDrug.notes}
                                />
                                <DetailRow
                                    icon={DollarSign}
                                    label="Price / Unit"
                                    value={selectedDrug.price ? `RM ${selectedDrug.price}` : "N/A"}
                                />
                                <DetailRow
                                    icon={UserCheck}
                                    label="Prescriber Category"
                                    value={selectedDrug.prescriberCat}
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 px-5 md:px-6 py-4 border-t border-slate-100 dark:border-slate-700 text-xs text-center text-slate-400 dark:text-slate-500">
                            Reference ID: {selectedDrug.id} • Source: HSM Formulary 2025
                        </div>
                    </div>
                )}
            </Modal>

            {/* Bottom Navigation (Visible on all screens) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-40 pb-safe">
                <div className="max-w-4xl mx-auto flex justify-between md:justify-around items-center h-16 overflow-x-auto no-scrollbar px-2">
                    <button
                        onClick={() => setAppMode('formulary')}
                        className={`flex flex-col items-center justify-center min-w-[64px] h-full space-y-1 ${appMode === 'formulary' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                        <Search size={20} />
                        <span className="text-[10px] font-medium">Formulary</span>
                    </button>
                    <button
                        onClick={() => setAppMode('nag')}
                        className={`flex flex-col items-center justify-center min-w-[64px] h-full space-y-1 ${appMode === 'nag' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                        <Shield size={20} />
                        <span className="text-[10px] font-medium">NAG</span>
                    </button>
                    <button
                        onClick={() => setAppMode('abx')}
                        className={`flex flex-col items-center justify-center min-w-[64px] h-full space-y-1 ${appMode === 'abx' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                        <Activity size={20} />
                        <span className="text-[10px] font-medium">Renal</span>
                    </button>
                    <button
                        onClick={() => setAppMode('dilution')}
                        className={`flex flex-col items-center justify-center min-w-[64px] h-full space-y-1 ${appMode === 'dilution' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                        <Beaker size={20} />
                        <span className="text-[10px] font-medium">Dilution</span>
                    </button>
                    <button
                        onClick={() => setAppMode('paediatric')}
                        className={`flex flex-col items-center justify-center min-w-[64px] h-full space-y-1 ${appMode === 'paediatric' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                        <Baby size={20} />
                        <span className="text-[10px] font-medium">Paeds</span>
                    </button>
                    <button
                        onClick={() => setAppMode('counseling')}
                        className={`flex flex-col items-center justify-center min-w-[64px] h-full space-y-1 ${appMode === 'counseling' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                        <MessageSquare size={20} />
                        <span className="text-[10px] font-medium">Counsel</span>
                    </button>

                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-8 mt-auto mb-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4 text-teal-600 dark:text-teal-400">
                        <Stethoscope size={24} />
                        <span className="font-bold text-lg tracking-tight">Hospital Seri Manjung</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                        © 2025 Hospital Seri Manjung. All Rights Reserved.
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                        For additions or to report issues, please contact <span className="font-semibold text-slate-600 dark:text-slate-300">Syahidah</span>
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
                        AUTHORIZED PERSONNEL ONLY. FOR THE USE OF HOSPITAL SERI MANJUNG STAFF ONLY
                    </p>
                </div>
            </footer>
        </div>
    );
}
