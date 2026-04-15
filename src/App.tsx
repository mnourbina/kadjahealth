/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Search, 
  Bell, 
  Home, 
  Activity, 
  Stethoscope, 
  Database, 
  Globe,
  ChevronRight,
  Bot,
  ShieldCheck,
  Users,
  Building2,
  PhoneCall,
  Heart,
  CheckCircle2,
  User,
  Settings,
  LogOut,
  CreditCard,
  HelpCircle,
  Mail,
  UserCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Star,
  Video,
  ClipboardList,
  Thermometer,
  Pill,
  Syringe,
  FileText,
  Trash2,
  AlertTriangle,
  Clock,
  BellRing,
  Plus,
  Minus,
  UserPlus,
  BriefcaseMedical,
  Microscope,
  MapPin,
  Download,
  Lock,
  BookOpen,
  MessageCircle,
  ShoppingBag,
  Info,
  Smartphone,
  Truck,
  Eye,
  ShieldAlert,
  Dna,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Screen = 'Accueil' | 'SSR' | 'Soins' | 'Données' | 'ZLECAf' | 'SIS' | 'PatientDetail' | 'AddPatient' | 'Assurance' | 'Profile' | 'DoctorProfile' | 'StaffRegistration' | 'Telemedicine' | 'Vaccination';
type SortKey = 'name' | 'age' | 'registeredAt';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  experience: string;
  patientsCount: number;
  rating: number;
  bio: string;
  availability: string;
}

interface MedicationReminder {
  medicineName: string;
  dosage: string;
  frequency: string;
  times: string[];
}

interface Consultation {
  date: string;
  reason: string;
  doctor: string;
  notes: string;
  type?: 'Général' | 'Examen' | 'Vaccin' | 'Pharmacie' | 'Urgence';
  reminderDate?: string;
  reminderTime?: string;
  medicationReminders?: MedicationReminder[];
}

interface LabResult {
  id: string;
  testName: string;
  date: string;
  value: string;
  unit: string;
  status: 'Normal' | 'Anormal' | 'Critique';
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  medicalHistory: string[];
  recentConsultations: Consultation[];
  labResults?: LabResult[];
  status: 'Stable' | 'Suivi' | 'Urgent';
  registeredAt: string;
}

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'Confirmé' | 'En attente' | 'Terminé';
  type: 'Vidéo' | 'Chat' | 'Présentiel';
}

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'dr-sarah',
    name: 'Dr. Sarah',
    specialty: 'Cardiologue',
    location: 'Clinique de l\'Espoir, N\'Djamena',
    experience: '12 ans',
    patientsCount: 1240,
    rating: 4.9,
    bio: 'Spécialiste en cardiologie interventionnelle avec une expertise particulière dans le traitement de l\'hypertension artérielle et des maladies coronariennes.',
    availability: 'Lun - Ven, 08:00 - 16:00'
  },
  {
    id: 'dr-marc',
    name: 'Dr. Marc',
    specialty: 'Médecin Généraliste',
    location: 'Hôpital de Référence, N\'Djamena',
    experience: '8 ans',
    patientsCount: 2100,
    rating: 4.7,
    bio: 'Médecin dévoué à la santé communautaire, spécialisé dans le suivi des maladies chroniques et la médecine préventive.',
    availability: 'Lun - Sam, 09:00 - 18:00'
  },
  {
    id: 'dr-fatime',
    name: 'Dr. Fatime',
    specialty: 'Pédiatre',
    location: 'Centre de Santé, Abéché',
    experience: '15 ans',
    patientsCount: 3500,
    rating: 5.0,
    bio: 'Experte en santé infantile et néonatologie, passionnée par le développement de l\'enfant.',
    availability: 'Lun - Jeu, 08:00 - 15:00'
  },
  {
    id: 'dr-youssouf',
    name: 'Dr. Youssouf',
    specialty: 'Neurologue',
    location: 'Hôpital Militaire, N\'Djamena',
    experience: '20 ans',
    patientsCount: 1800,
    rating: 4.8,
    bio: 'Spécialiste des troubles du système nerveux, expert en épilepsie et accidents vasculaires cérébraux.',
    availability: 'Mer - Ven, 10:00 - 17:00'
  }
];
const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Amadou Diallo',
    age: 45,
    gender: 'M',
    bloodType: 'O+',
    phone: '+235 66 00 00 01',
    email: 'amadou.diallo@email.td',
    address: 'Quartier Moursal, N\'Djamena',
    medicalHistory: ['Hypertension', 'Allergie au pollen'],
    status: 'Stable',
    registeredAt: '2024-01-10',
    recentConsultations: [
      { date: '2024-03-10', reason: 'Contrôle tension', doctor: 'Dr. Sarah', notes: 'Tension stable, continuer le traitement.' },
      { date: '2024-01-15', reason: 'Grippe saisonnière', doctor: 'Dr. Marc', notes: 'Repos prescrit.' }
    ]
  },
  {
    id: '2',
    name: 'Fatima Sow',
    age: 28,
    gender: 'F',
    bloodType: 'A-',
    phone: '+235 99 11 22 33',
    email: 'fatima.sow@email.td',
    address: 'Quartier Sabangali, N\'Djamena',
    medicalHistory: ['Asthme'],
    status: 'Suivi',
    registeredAt: '2024-02-15',
    recentConsultations: [
      { date: '2024-02-20', reason: 'Suivi asthme', doctor: 'Dr. Sarah', notes: 'Utilisation correcte de l\'inhalateur.' }
    ]
  }
];

// --- Components ---

const StaffRegistrationForm = ({ onBack }: { onBack: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'clinicien' as 'clinicien' | 'paraclinicien',
    specialty: '',
    affiliationType: 'public' as 'public' | 'prive' | 'ong',
    facilityName: '',
    registrationNumber: '',
    address: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const specialties = {
    clinicien: [
      'Médecine Générale', 'Cardiologie', 'Pédiatrie', 'Gynécologie-Obstétrique', 
      'Chirurgie Générale', 'Ophtalmologie', 'Dermatologie', 'Psychiatrie', 'Neurologie'
    ],
    paraclinicien: [
      'Infirmier(e)', 'Sage-femme', 'Technicien de Laboratoire', 'Radiologie / Imagerie', 
      'Pharmacie', 'Anesthésie-Réanimation', 'Nutrition / Diététique', 'Kinésithérapie'
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen pb-24 bg-gray-50"
    >
      <div className="bg-emerald-600 px-6 pt-12 pb-10 rounded-b-[40px] shadow-lg text-white">
        <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors mb-6">
          <ChevronRight className="rotate-180" size={20} />
        </button>
        <h2 className="text-2xl font-black mb-1">Inscription Médicale</h2>
        <p className="text-emerald-100 text-sm font-medium">Rejoignez le réseau de santé Kadja Health</p>
      </div>

      <div className="px-6 -mt-6">
        {isSubmitted ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-10 shadow-xl text-center space-y-4"
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900">Demande Envoyée !</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Votre dossier est en cours de vérification par nos services. Vous recevrez une confirmation par email sous 48h.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Informations Personnelles</h4>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 ml-1">Nom Complet</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required
                      type="text"
                      placeholder="ex: Dr. Mahamat Ali"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1">Email Professionnel</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="email"
                        placeholder="contact@sante.td"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 ml-1">Téléphone</label>
                    <div className="relative">
                      <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="tel"
                        placeholder="+235 ..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 ml-1">Adresse / Provenance</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                    <textarea 
                      required
                      placeholder="Quartier, Ville, Province..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm min-h-[100px]"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Corps Médical & Spécialité</h4>
                
                <div className="flex p-1 bg-gray-100 rounded-2xl">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, category: 'clinicien', specialty: ''})}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                      formData.category === 'clinicien' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Clinicien
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, category: 'paraclinicien', specialty: ''})}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                      formData.category === 'paraclinicien' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Paraclinicien
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 ml-1">Spécialité</label>
                  <div className="relative">
                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm appearance-none"
                      value={formData.specialty}
                      onChange={e => setFormData({...formData, specialty: e.target.value})}
                    >
                      <option value="">Sélectionnez votre spécialité</option>
                      {specialties[formData.category].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Appartenance Sanitaire</h4>
                
                <div className="grid grid-cols-3 gap-2">
                  {(['public', 'prive', 'ong'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, affiliationType: type})}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                        formData.affiliationType === type 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                          : 'bg-white border-gray-100 text-gray-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 ml-1">Nom de la Structure</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required
                      type="text"
                      placeholder="ex: Hôpital de la Renaissance"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                      value={formData.facilityName}
                      onChange={e => setFormData({...formData, facilityName: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <BriefcaseMedical size={20} />
              Finaliser mon inscription
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

const DoctorProfile = ({ doctor, onBack }: { doctor: Doctor, onBack: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col min-h-screen pb-24 bg-gray-50"
  >
    <div className="bg-blue-600 px-6 pt-12 pb-20 rounded-b-[40px] shadow-lg relative">
      <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors mb-6 text-white">
        <ChevronRight className="rotate-180" size={20} />
      </button>
      
      <div className="flex flex-col items-center text-center text-white">
        <div className="w-24 h-24 rounded-[32px] bg-white/20 border-4 border-white/30 shadow-xl overflow-hidden mb-4">
          <img 
            src={`https://picsum.photos/seed/${doctor.id}/200/200`} 
            alt={doctor.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <h3 className="text-2xl font-black">{doctor.name}</h3>
        <p className="text-blue-100 font-medium">{doctor.specialty}</p>
      </div>
    </div>

    <div className="px-6 -mt-10 space-y-6">
      <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex justify-around">
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expérience</p>
          <p className="text-sm font-black text-gray-900">{doctor.experience}</p>
        </div>
        <div className="w-px h-8 bg-gray-100 self-center" />
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Patients</p>
          <p className="text-sm font-black text-gray-900">{doctor.patientsCount}+</p>
        </div>
        <div className="w-px h-8 bg-gray-100 self-center" />
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Note</p>
          <p className="text-sm font-black text-gray-900">⭐ {doctor.rating}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Biographie</h4>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            {doctor.bio}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Lieu d'exercice</p>
              <p className="text-sm font-bold text-gray-800">{doctor.location}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Disponibilité</p>
              <p className="text-sm font-bold text-gray-800">{doctor.availability}</p>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
        Prendre rendez-vous
      </button>
    </div>
  </motion.div>
);

const NotificationCenter = ({ 
  isOpen, 
  onClose, 
  notifications 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  notifications: { patientName: string, date: string, time: string, reason: string }[] 
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 pt-24">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="relative bg-white w-full max-w-xs rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Bell size={16} />
              </div>
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Rappels</h3>
            </div>
            <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
            {notifications.length > 0 ? (
              notifications.map((n, i) => (
                <div key={i} className="p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">{n.patientName}</span>
                    <span className="text-[9px] text-gray-400 font-bold">{n.date}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-800 mb-1">{n.reason}</p>
                  <div className="flex items-center gap-1 text-[9px] text-gray-500 font-medium">
                    <Clock size={10} />
                    <span>Prévu à {n.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center flex flex-col items-center gap-2">
                <BellRing size={24} className="text-gray-200" />
                <p className="text-xs text-gray-400 font-medium">Aucun rappel pour le moment</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={onClose}
            className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-colors border-t border-gray-50"
          >
            Fermer
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  variant = "danger"
}: { 
  isOpen: boolean, 
  title: string, 
  message: string, 
  onConfirm: () => void, 
  onCancel: () => void,
  confirmLabel?: string,
  cancelLabel?: string,
  variant?: "danger" | "warning"
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl overflow-hidden"
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'
          }`}>
            <AlertTriangle size={28} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{message}</p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={onConfirm}
              className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg ${
                variant === 'danger' 
                  ? 'bg-red-500 text-white shadow-red-100 hover:bg-red-600' 
                  : 'bg-orange-500 text-white shadow-orange-100 hover:bg-orange-600'
              }`}
            >
              {confirmLabel}
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all"
            >
              {cancelLabel}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const AddPatientForm = ({ onAdd, onBack }: { onAdd: (p: Patient) => void, onBack: () => void }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [bloodType, setBloodType] = useState('O+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = "Le nom est obligatoire";
    else if (name.trim().length < 2) newErrors.name = "Le nom est trop court";

    if (!age) newErrors.age = "L'âge est obligatoire";
    else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) newErrors.age = "Âge invalide (0-120)";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (phone && !/^\+?[0-9\s-]{8,20}$/.test(phone)) {
      newErrors.phone = "Format de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      age: parseInt(age),
      gender,
      bloodType,
      phone,
      email,
      address,
      medicalHistory: [],
      recentConsultations: [],
      status: 'Stable',
      registeredAt: new Date().toISOString().split('T')[0]
    };
    onAdd(newPatient);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-col min-h-screen pb-24 bg-white"
    >
      <div className="px-6 pt-8 pb-6 bg-blue-600 text-white rounded-b-[40px] shadow-lg mb-8">
        <button onClick={onBack} className="mb-6 p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
          <ChevronRight className="rotate-180" size={20} />
        </button>
        <h2 className="text-2xl font-bold">Nouveau Patient</h2>
        <p className="opacity-80 text-sm">Enregistrer un nouveau dossier médical</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Nom Complet</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            placeholder="ex: Jean Dupont"
            className={`w-full bg-gray-50 border rounded-2xl py-4 px-5 outline-none focus:ring-2 transition-all ${
              errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-100 focus:ring-blue-500'
            }`}
          />
          {errors.name && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Âge</label>
            <input 
              type="number" 
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                if (errors.age) setErrors(prev => ({ ...prev, age: '' }));
              }}
              placeholder="ex: 30"
              className={`w-full bg-gray-50 border rounded-2xl py-4 px-5 outline-none focus:ring-2 transition-all ${
                errors.age ? 'border-red-300 focus:ring-red-500' : 'border-gray-100 focus:ring-blue-500'
              }`}
            />
            {errors.age && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.age}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Sexe</label>
            <select 
              value={gender}
              onChange={(e) => setGender(e.target.value as 'M' | 'F')}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
            >
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Groupe Sanguin</label>
          <select 
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
          >
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Coordonnées</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Téléphone</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
              }}
              placeholder="+235 ..."
              className={`w-full bg-gray-50 border rounded-2xl py-4 px-5 outline-none focus:ring-2 transition-all ${
                errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-100 focus:ring-blue-500'
              }`}
            />
            {errors.phone && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="patient@email.td"
              className={`w-full bg-gray-50 border rounded-2xl py-4 px-5 outline-none focus:ring-2 transition-all ${
                errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-100 focus:ring-blue-500'
              }`}
            />
            {errors.email && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Adresse</label>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Quartier, Ville..."
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all mt-4"
        >
          Enregistrer le Patient
        </button>
      </form>
    </motion.div>
  );
};

const PatientList = ({ 
  patients, 
  onSelect, 
  onAdd,
  onDelete,
  sortKey,
  sortOrder,
  onSortChange,
  onExport
}: { 
  patients: Patient[], 
  onSelect: (p: Patient) => void, 
  onAdd: () => void,
  onDelete: (id: string) => void,
  sortKey: SortKey,
  sortOrder: 'asc' | 'desc',
  onSortChange: (key: SortKey) => void,
  onExport: () => void
}) => (
  <section className="px-6 mb-8">
    <div className="flex items-center justify-between mb-4 bg-white border border-gray-200 p-2 rounded-xl shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-sleek-dim uppercase tracking-widest ml-2">Trier par :</span>
        <div className="flex gap-1">
          {[
            { key: 'name', label: 'Nom' },
            { key: 'age', label: 'Âge' },
            { key: 'registeredAt', label: 'Date' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onSortChange(item.key as SortKey)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                sortKey === item.key 
                  ? 'bg-sleek-accent text-white shadow-sm' 
                  : 'bg-gray-50 text-sleek-dim hover:bg-gray-100'
              }`}
            >
              {item.label}
              {sortKey === item.key && (
                sortOrder === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />
              )}
            </button>
          ))}
        </div>
      </div>
      <button 
        onClick={onExport}
        className="p-2 bg-white text-sleek-accent rounded-lg hover:bg-blue-50 transition-all border border-gray-200 shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
        title="Exporter en CSV"
      >
        <Download size={14} />
      </button>
    </div>

    <div className="space-y-3">
      {patients.map(patient => (
        <div 
          key={patient.id}
          className="w-full bg-sleek-card border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative group"
        >
          <button 
            onClick={() => onDelete(patient.id)}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-sleek-sidebar font-bold text-base border border-gray-200">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-sleek-text text-base">{patient.name}</h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
                <span className="text-[10px] text-sleek-dim font-bold uppercase tracking-wider">
                  {patient.age} ans • {patient.gender === 'M' ? 'M' : 'F'} • {patient.bloodType}
                </span>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
              patient.status === 'Urgent' ? 'bg-red-50 border-red-100 text-red-600' : 
              patient.status === 'Suivi' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-emerald-50 border-emerald-100 text-sleek-status'
            }`}>
              {patient.status === 'Urgent' ? <AlertTriangle size={10} /> : 
               patient.status === 'Suivi' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
              {patient.status}
            </div>
          </div>

          {patient.recentConsultations.length > 0 && (
            <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-500 border border-gray-100 flex-shrink-0 shadow-sm">
                <ClipboardList size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Dernière consultation</span>
                  <span className="text-[9px] text-blue-600 font-bold">{patient.recentConsultations[0].date}</span>
                </div>
                <p className="text-[11px] text-gray-700 font-medium truncate">
                  {patient.recentConsultations[0].reason}
                </p>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => onSelect(patient)}
            className="w-full py-2.5 bg-gray-50 text-sleek-sidebar text-[11px] font-black uppercase tracking-widest rounded-lg border border-gray-100 hover:bg-sleek-accent hover:text-white hover:border-sleek-accent transition-all"
          >
            Ouvrir le dossier
          </button>
        </div>
      ))}
      
      <button 
        onClick={onAdd}
        className="w-full py-6 border-2 border-dashed border-gray-200 rounded-xl text-sleek-dim hover:border-sleek-accent hover:text-sleek-accent hover:bg-blue-50 transition-all flex flex-col items-center gap-2 group"
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
          <Plus size={20} />
        </div>
        <span className="text-xs font-black uppercase tracking-widest">Nouveau Patient</span>
      </button>
    </div>
  </section>
);

const PatientDetailView = ({ 
  patient, 
  onBack, 
  onAddConsultation,
  onDeletePatient,
  onDeleteConsultation,
  onUpdateConsultation,
  onAddLabResult,
  onDoctorClick
}: { 
  patient: Patient, 
  onBack: () => void, 
  onAddConsultation: (patientId: string, consultation: Consultation) => void,
  onDeletePatient: (id: string) => void,
  onDeleteConsultation: (patientId: string, index: number) => void,
  onUpdateConsultation: (patientId: string, index: number, updated: Consultation) => void,
  onAddLabResult: (patientId: string, labResult: LabResult) => void,
  onDoctorClick: (name: string) => void
}) => {
  const [isAddingConsultation, setIsAddingConsultation] = useState(false);
  const [reason, setReason] = useState('');
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState<Consultation['type']>('Général');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [showReminder, setShowReminder] = useState(false);

  const [medReminders, setMedReminders] = useState<MedicationReminder[]>([]);
  const [showMedReminders, setShowMedReminders] = useState(false);

  const [editingReminderIdx, setEditingReminderIdx] = useState<number | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  const [isAddingLabResult, setIsAddingLabResult] = useState(false);
  const [testName, setTestName] = useState('');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [testValue, setTestValue] = useState('');
  const [testUnit, setTestUnit] = useState('');
  const [testStatus, setTestStatus] = useState<LabResult['status']>('Normal');

  const handleSaveReminder = (index: number) => {
    const updated = { ...patient.recentConsultations[index], reminderDate: editDate, reminderTime: editTime };
    onUpdateConsultation(patient.id, index, updated);
    setEditingReminderIdx(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newConsultation: Consultation = {
      date: new Date().toISOString().split('T')[0],
      reason,
      doctor,
      notes,
      type,
      reminderDate: showReminder ? reminderDate : undefined,
      reminderTime: showReminder ? reminderTime : undefined,
      medicationReminders: showMedReminders ? medReminders : undefined
    };
    onAddConsultation(patient.id, newConsultation);
    setIsAddingConsultation(false);
    setReason('');
    setDoctor('');
    setNotes('');
    setType('Général');
    setReminderDate('');
    setReminderTime('');
    setShowReminder(false);
    setMedReminders([]);
    setShowMedReminders(false);
  };

  const handleLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLabResult: LabResult = {
      id: Math.random().toString(36).substr(2, 9),
      testName,
      date: testDate,
      value: testValue,
      unit: testUnit,
      status: testStatus
    };
    onAddLabResult(patient.id, newLabResult);
    setIsAddingLabResult(false);
    setTestName('');
    setTestValue('');
    setTestUnit('');
    setTestStatus('Normal');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen pb-24"
    >
      <div className="px-6 pt-8 pb-6 bg-blue-600 text-white rounded-b-[40px] shadow-lg relative">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <button 
            onClick={() => onDeletePatient(patient.id)}
            className="p-2 bg-red-500/20 text-white rounded-xl hover:bg-red-500/40 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{patient.name}</h2>
            <p className="opacity-80 text-sm">{patient.age} ans • {patient.gender} • Groupe {patient.bloodType}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-100 border border-gray-50 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Coordonnées</h3>
            <div className="space-y-3">
              {patient.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                    <span className="text-xs">📞</span>
                  </div>
                  <span className="text-sm font-medium">{patient.phone}</span>
                </div>
              )}
              {patient.email && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                    <span className="text-xs">✉️</span>
                  </div>
                  <span className="text-sm font-medium">{patient.email}</span>
                </div>
              )}
              {patient.address && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                    <span className="text-xs">📍</span>
                  </div>
                  <span className="text-sm font-medium">{patient.address}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Antécédents Médicaux</h3>
            <div className="flex flex-wrap gap-2">
              {patient.medicalHistory.length > 0 ? (
                patient.medicalHistory.map((item, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">Aucun antécédent enregistré</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Historique des Consultations</h3>
            <div className="h-48 w-full bg-gray-50 rounded-3xl p-4 border border-gray-100">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(() => {
                  const last12Months = Array.from({ length: 12 }, (_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - (11 - i));
                    return {
                      month: d.toLocaleString('fr-FR', { month: 'short' }),
                      year: d.getFullYear(),
                      count: 0,
                      key: `${d.getFullYear()}-${d.getMonth()}`
                    };
                  });

                  patient.recentConsultations.forEach(c => {
                    const cDate = new Date(c.date);
                    const key = `${cDate.getFullYear()}-${cDate.getMonth()}`;
                    const monthData = last12Months.find(m => m.key === key);
                    if (monthData) monthData.count++;
                  });

                  return last12Months;
                })()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-[10px] font-bold shadow-xl">
                            {payload[0].value} consultation(s)
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[6, 6, 0, 0]} 
                    barSize={16}
                  >
                    {(() => {
                      const data = Array.from({ length: 12 });
                      return data.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 11 ? '#2563eb' : '#e2e8f0'} 
                          className="hover:fill-blue-500 transition-colors cursor-pointer"
                        />
                      ));
                    })()}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Résultats de Laboratoire</h3>
              <button 
                onClick={() => setIsAddingLabResult(true)}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            <AnimatePresence>
              {isAddingLabResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <form onSubmit={handleLabSubmit} className="bg-indigo-50 rounded-2xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 block">Nom de l'examen</label>
                        <input 
                          type="text" 
                          required
                          value={testName}
                          onChange={(e) => setTestName(e.target.value)}
                          placeholder="ex: Glycémie, NFS..."
                          className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 block">Valeur</label>
                        <input 
                          type="text" 
                          required
                          value={testValue}
                          onChange={(e) => setTestValue(e.target.value)}
                          placeholder="ex: 1.10"
                          className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 block">Unité</label>
                        <input 
                          type="text" 
                          required
                          value={testUnit}
                          onChange={(e) => setTestUnit(e.target.value)}
                          placeholder="ex: g/L"
                          className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 block">Date</label>
                        <input 
                          type="date" 
                          required
                          value={testDate}
                          onChange={(e) => setTestDate(e.target.value)}
                          className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 block">Statut</label>
                        <select 
                          value={testStatus}
                          onChange={(e) => setTestStatus(e.target.value as LabResult['status'])}
                          className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Anormal">Anormal</option>
                          <option value="Critique">Critique</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button 
                        type="submit"
                        className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-xl text-xs shadow-lg shadow-indigo-200"
                      >
                        Ajouter le résultat
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsAddingLabResult(false)}
                        className="px-4 py-2 bg-white text-gray-400 font-bold rounded-xl text-xs border border-indigo-100"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {patient.labResults && patient.labResults.length > 0 ? (
                patient.labResults.map((result) => (
                  <div key={result.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-sm">{result.testName}</h4>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        result.status === 'Normal' ? 'bg-emerald-50 text-emerald-600' : 
                        result.status === 'Anormal' ? 'bg-orange-50 text-orange-600' : 
                        'bg-red-50 text-red-600'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-gray-900">{result.value}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{result.unit}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{result.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400">Aucun résultat de laboratoire</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Consultations Récentes</h3>
              <button 
                onClick={() => setIsAddingConsultation(!isAddingConsultation)}
                className="text-blue-500 text-xs font-bold hover:underline"
              >
                {isAddingConsultation ? 'Annuler' : '+ Ajouter'}
              </button>
            </div>

            <AnimatePresence>
              {isAddingConsultation && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 overflow-hidden"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de Consultation</label>
                    <div className="flex flex-wrap gap-2">
                      {(['Général', 'Examen', 'Vaccin', 'Pharmacie', 'Urgence'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                            type === t 
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                              : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Motif de consultation</label>
                    <input 
                      required
                      type="text" 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="ex: Contrôle annuel, Douleurs abdominales..."
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Médecin</label>
                    <input 
                      required
                      type="text" 
                      value={doctor}
                      onChange={(e) => setDoctor(e.target.value)}
                      placeholder="Dr. ..."
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Notes</label>
                    <textarea 
                      required
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Observations cliniques..."
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px]"
                    />
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <button 
                      type="button"
                      onClick={() => setShowReminder(!showReminder)}
                      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                        showReminder ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        showReminder ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
                      }`}>
                        {showReminder && <CheckCircle2 size={10} />}
                      </div>
                      Définir un rappel de rendez-vous
                    </button>

                    <AnimatePresence>
                      {showReminder && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-2 gap-3 mt-3 overflow-hidden"
                        >
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Date du rappel</label>
                            <input 
                              type="date" 
                              value={reminderDate}
                              onChange={(e) => setReminderDate(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Heure</label>
                            <input 
                              type="time" 
                              value={reminderTime}
                              onChange={(e) => setReminderTime(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <button 
                      type="button"
                      onClick={() => setShowMedReminders(!showMedReminders)}
                      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                        showMedReminders ? 'text-emerald-600' : 'text-gray-400'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        showMedReminders ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300'
                      }`}>
                        {showMedReminders && <CheckCircle2 size={10} />}
                      </div>
                      Rappels de médicaments
                    </button>

                    <AnimatePresence>
                      {showMedReminders && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 space-y-3 overflow-hidden"
                        >
                          {medReminders.map((med, idx) => (
                            <div key={idx} className="p-3 bg-white border border-gray-100 rounded-xl space-y-2 relative">
                              <button 
                                type="button"
                                onClick={() => setMedReminders(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                              >
                                <Minus size={14} />
                              </button>
                              <div className="grid grid-cols-2 gap-2">
                                <input 
                                  placeholder="Nom du médicament"
                                  value={med.medicineName}
                                  onChange={(e) => {
                                    const newMeds = [...medReminders];
                                    newMeds[idx].medicineName = e.target.value;
                                    setMedReminders(newMeds);
                                  }}
                                  className="text-[10px] p-2 border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                                <input 
                                  placeholder="Dosage (ex: 500mg)"
                                  value={med.dosage}
                                  onChange={(e) => {
                                    const newMeds = [...medReminders];
                                    newMeds[idx].dosage = e.target.value;
                                    setMedReminders(newMeds);
                                  }}
                                  className="text-[10px] p-2 border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <input 
                                  placeholder="Fréquence (ex: 3x/jour)"
                                  value={med.frequency}
                                  onChange={(e) => {
                                    const newMeds = [...medReminders];
                                    newMeds[idx].frequency = e.target.value;
                                    setMedReminders(newMeds);
                                  }}
                                  className="text-[10px] p-2 border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                                <input 
                                  placeholder="Heures (ex: 08:00, 20:00)"
                                  value={med.times.join(', ')}
                                  onChange={(e) => {
                                    const newMeds = [...medReminders];
                                    newMeds[idx].times = e.target.value.split(',').map(t => t.trim());
                                    setMedReminders(newMeds);
                                  }}
                                  className="text-[10px] p-2 border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => setMedReminders([...medReminders, { medicineName: '', dosage: '', frequency: '', times: [] }])}
                            className="w-full py-2 border border-dashed border-emerald-200 rounded-xl text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus size={12} />
                            Ajouter un médicament
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-sm shadow-md shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    Enregistrer la consultation
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {patient.recentConsultations.length > 0 ? (
                patient.recentConsultations.map((c, i) => {
                  const getIcon = () => {
                    switch(c.type) {
                      case 'Examen': return <ClipboardList size={14} />;
                      case 'Vaccin': return <Syringe size={14} />;
                      case 'Pharmacie': return <Pill size={14} />;
                      case 'Urgence': return <Activity size={14} />;
                      default: return <Stethoscope size={14} />;
                    }
                  };
                  
                  const getIconColor = () => {
                    switch(c.type) {
                      case 'Examen': return 'bg-purple-100 text-purple-600';
                      case 'Vaccin': return 'bg-emerald-100 text-emerald-600';
                      case 'Pharmacie': return 'bg-orange-100 text-orange-600';
                      case 'Urgence': return 'bg-red-100 text-red-600';
                      default: return 'bg-blue-100 text-blue-600';
                    }
                  };

                  return (
                    <div key={i} className="group relative pl-8 pb-6 last:pb-0">
                      {/* Timeline Line */}
                      <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-100 group-last:hidden" />
                      
                      {/* Timeline Dot/Icon */}
                      <div className={`absolute left-0 top-0 w-6 h-6 rounded-lg flex items-center justify-center shadow-sm z-10 ${getIconColor()}`}>
                        {getIcon()}
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {c.date}
                            </span>
                            {c.type && (
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                • {c.type}
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => onDoctorClick(c.doctor)}
                            className="text-[10px] text-gray-400 font-medium flex items-center gap-1 hover:text-blue-500 transition-colors"
                          >
                            <User size={10} />
                            {c.doctor}
                          </button>
                        </div>
                        
                        <h4 className="font-bold text-gray-900 text-sm">{c.reason}</h4>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          {c.reminderDate ? (
                            <div className="bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-xl flex items-center gap-2 border border-blue-100 shadow-sm">
                              <BellRing size={12} className="animate-pulse" />
                              <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-60 leading-none mb-0.5">Rappel programmé</span>
                                <span className="text-[10px] font-bold leading-none">
                                  {c.reminderDate} à {c.reminderTime || '08:00'}
                                </span>
                              </div>
                              <button 
                                onClick={() => {
                                  setEditingReminderIdx(i);
                                  setEditDate(c.reminderDate || '');
                                  setEditTime(c.reminderTime || '');
                                }}
                                className="ml-1 p-1 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                <Settings size={10} />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setEditingReminderIdx(i);
                                setEditDate('');
                                setEditTime('');
                              }}
                              className="text-[9px] font-black uppercase tracking-widest text-gray-400 border border-dashed border-gray-200 px-2.5 py-1.5 rounded-xl hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center gap-1.5"
                            >
                              <Clock size={12} />
                              Ajouter un rappel
                            </button>
                          )}
                        </div>

                        {c.medicationReminders && c.medicationReminders.length > 0 && (
                          <div className="mb-3 space-y-2">
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Traitement prescrit</p>
                            <div className="grid grid-cols-1 gap-2">
                              {c.medicationReminders.map((med, idx) => (
                                <div key={idx} className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between group/med">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                      <Pill size={16} />
                                    </div>
                                    <div>
                                      <h5 className="text-xs font-bold text-gray-900">{med.medicineName} <span className="text-[10px] text-gray-500 font-medium">({med.dosage})</span></h5>
                                      <p className="text-[10px] text-emerald-600 font-bold">{med.frequency} • <span className="text-gray-500">{med.times.join(', ')}</span></p>
                                    </div>
                                  </div>
                                  <div className="opacity-0 group-hover/med:opacity-100 transition-opacity">
                                    <BellRing size={12} className="text-emerald-400" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <AnimatePresence>
                          {editingReminderIdx === i && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mb-3 p-3 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3 overflow-hidden"
                            >
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[8px] font-black text-blue-600 uppercase tracking-widest ml-1">Date</label>
                                  <input 
                                    type="date" 
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    className="w-full bg-white border border-blue-100 rounded-lg py-1.5 px-2 text-[10px] outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-black text-blue-600 uppercase tracking-widest ml-1">Heure</label>
                                  <input 
                                    type="time" 
                                    value={editTime}
                                    onChange={(e) => setEditTime(e.target.value)}
                                    className="w-full bg-white border border-blue-100 rounded-lg py-1.5 px-2 text-[10px] outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleSaveReminder(i)}
                                  className="flex-1 bg-blue-600 text-white text-[9px] font-black py-2 rounded-lg shadow-sm"
                                >
                                  Enregistrer
                                </button>
                                <button 
                                  onClick={() => setEditingReminderIdx(null)}
                                  className="px-3 text-[9px] font-bold text-gray-400 hover:text-gray-600"
                                >
                                  Annuler
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100/50 relative group/note">
                          <p className="text-xs text-gray-600 leading-relaxed italic">"{c.notes}"</p>
                          <button 
                            onClick={() => onDeleteConsultation(patient.id, i)}
                            className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover/note:opacity-100 shadow-sm"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <Calendar className="text-gray-300 mb-2" size={24} />
                  <span className="text-xs text-gray-400 font-medium">Aucune consultation enregistrée</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Header = ({ 
  onProfileClick, 
  onNotificationClick,
  notificationCount 
}: { 
  onProfileClick: () => void, 
  onNotificationClick: () => void,
  notificationCount: number
}) => (
  <header className="h-16 bg-sleek-card border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
    <div className="flex items-center gap-2">
      <h1 className="text-lg font-bold text-sleek-sidebar flex items-center gap-2">
        Kadja Health <span className="bg-sleek-accent text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">PRO</span>
      </h1>
    </div>
    <div className="flex items-center gap-4">
      <div 
        onClick={onNotificationClick}
        className="relative p-2 text-sleek-dim hover:text-sleek-accent transition-colors cursor-pointer"
      >
        <Bell size={20} />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 bg-sleek-status text-white text-[8px] font-bold px-1 rounded-full border border-white">
            {notificationCount}
          </span>
        )}
      </div>
      <button 
        onClick={onProfileClick}
        className="w-8 h-8 rounded-full bg-gray-200 border border-gray-200 overflow-hidden hover:ring-2 hover:ring-sleek-accent/20 transition-all"
      >
        <img 
          src="https://picsum.photos/seed/avatar/100/100" 
          alt="User Profile" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </button>
    </div>
  </header>
);

const ProfileScreen = ({ 
  onBack, 
  settings, 
  onUpdateSettings 
}: { 
  onBack: () => void,
  settings: {
    pushNotifications: boolean,
    emailNotifications: boolean,
    darkMode: boolean,
    language: string
  },
  onUpdateSettings: (s: any) => void
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col min-h-screen pb-24 bg-gray-50"
  >
    <div className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
          <ChevronRight className="rotate-180" size={20} />
        </button>
        <h2 className="text-xl font-black text-gray-900">Mon Profil</h2>
        <div className="w-10" />
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-[32px] bg-blue-100 border-4 border-white shadow-lg overflow-hidden">
            <img 
              src="https://picsum.photos/seed/avatar/200/200" 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-xl border-4 border-white flex items-center justify-center text-white">
            <Bot size={14} />
          </div>
        </div>
        <h3 className="text-2xl font-black text-gray-900">Dr. Moussa Mahamat</h3>
        <p className="text-sm text-gray-500 font-medium">Administrateur Santé • N'Djamena</p>
      </div>
    </div>

    <div className="px-6 py-8 space-y-8">
      {/* Paramètres Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-sleek-dim uppercase tracking-widest ml-1">Paramètres de l'application</h4>
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200 space-y-6">
          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sleek-sidebar mb-2">
              <BellRing size={18} className="text-sleek-accent" />
              <span className="text-xs font-black uppercase tracking-wider">Notifications</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700">Notifications Push</span>
                <span className="text-[10px] text-gray-400">Alertes en temps réel sur mobile</span>
              </div>
              <button 
                onClick={() => onUpdateSettings({ pushNotifications: !settings.pushNotifications })}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.pushNotifications ? 'bg-sleek-accent' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: settings.pushNotifications ? 26 : 2 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700">Rapports par Email</span>
                <span className="text-[10px] text-gray-400">Résumé hebdomadaire des activités</span>
              </div>
              <button 
                onClick={() => onUpdateSettings({ emailNotifications: !settings.emailNotifications })}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailNotifications ? 'bg-sleek-accent' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: settings.emailNotifications ? 26 : 2 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Thème */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sleek-sidebar mb-2">
              <Sun size={18} className="text-orange-500" />
              <span className="text-xs font-black uppercase tracking-wider">Apparence</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700">Mode Sombre</span>
                <span className="text-[10px] text-gray-400">Réduit la fatigue oculaire</span>
              </div>
              <button 
                onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.darkMode ? 'bg-slate-800' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: settings.darkMode ? 26 : 2 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm flex items-center justify-center"
                >
                  {settings.darkMode ? <Moon size={8} className="text-slate-800" /> : <Sun size={8} className="text-orange-500" />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Compte</h4>
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 space-y-1">
          {[
            { icon: User, label: 'Informations personnelles', color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: ShieldCheck, label: 'Sécurité & Confidentialité', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { icon: CreditCard, label: 'Abonnement & Facturation', color: 'text-orange-500', bg: 'bg-orange-50' },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`${item.bg} ${item.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <item.icon size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support</h4>
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 space-y-1">
          {[
            { icon: HelpCircle, label: 'Centre d\'aide', color: 'text-purple-500', bg: 'bg-purple-50' },
            { icon: Mail, label: 'Nous contacter', color: 'text-pink-500', bg: 'bg-pink-50' },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`${item.bg} ${item.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <item.icon size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <button className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-3xl hover:bg-red-100 transition-colors group">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <LogOut size={20} />
        </div>
        <span className="font-black text-sm">Déconnexion</span>
      </button>
    </div>
  </motion.div>
);

const SearchBar = () => (
  <div className="px-6 py-4">
    <div className="relative flex items-center">
      <Search className="absolute left-4 text-sleek-dim" size={18} />
      <input 
        type="text" 
        placeholder="Rechercher un patient ou un service..." 
        className="w-full bg-sleek-card border border-gray-200 rounded-lg py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-sleek-accent/20 focus:border-sleek-accent transition-all outline-none shadow-sm"
      />
    </div>
  </div>
);

const PatientStats = ({ total, active, newCount }: { total: number, active: number, newCount: number }) => (
  <div className="px-6 mb-8">
    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Statistiques de patients</h3>
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
          <Users size={16} />
        </div>
        <div className="text-xl font-black text-gray-900">{total.toLocaleString()}</div>
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total</div>
      </div>
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
          <Activity size={16} />
        </div>
        <div className="text-xl font-black text-gray-900">{active.toLocaleString()}</div>
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Actifs</div>
      </div>
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-3">
          <UserPlus size={16} />
        </div>
        <div className="text-xl font-black text-gray-900">{newCount.toLocaleString()}</div>
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Nouveaux</div>
      </div>
    </div>
  </div>
);

const SolutionsSection = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => (
  <section className="px-6 mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xs font-black text-sleek-dim uppercase tracking-widest">Nos Solutions</h2>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {[
        { id: 'SSR', name: 'SSR', color: 'bg-pink-500', icon: Activity },
        { id: 'Soins', name: 'Care', color: 'bg-emerald-500', icon: Stethoscope },
        { id: 'Vaccination', name: 'Vax', color: 'bg-blue-500', icon: Syringe },
        { id: 'Données', name: 'Data', color: 'bg-indigo-500', icon: Database },
      ].map((item) => (
        <button 
          key={item.id}
          onClick={() => onNavigate(item.id as Screen)}
          className="flex flex-col items-center gap-2 p-2 bg-sleek-card border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all group"
        >
          <div className={`${item.color} w-8 h-8 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
            <item.icon size={16} />
          </div>
          <span className="text-[9px] font-black text-sleek-sidebar uppercase tracking-wider text-center leading-tight">
            {item.name}
          </span>
        </button>
      ))}
    </div>
  </section>
);

const ProfessionalSection = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => (
  <section className="px-6 mb-8">
    <div className="bg-sleek-sidebar rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <BriefcaseMedical size={20} />
          </div>
          <h3 className="text-base font-black">Espace Pro</h3>
        </div>
        <p className="text-slate-400 text-[11px] mb-6 leading-relaxed max-w-[200px]">
          Rejoignez notre réseau de soins en tant que clinicien ou paraclinicien.
        </p>
        <button 
          onClick={() => onNavigate('StaffRegistration')}
          className="bg-sleek-accent text-white font-black px-6 py-3 rounded-md text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-500 transition-all active:scale-95"
        >
          S'inscrire
        </button>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12">
        <Stethoscope size={100} />
      </div>
    </div>
  </section>
);

const InnovationSection = () => (
  <section className="px-6 mb-24">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xs font-black text-sleek-dim uppercase tracking-widest">Innovation ZLECAf</h2>
      <span className="bg-sleek-status text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
        Nouveau
      </span>
    </div>
    <div className="bg-sleek-card border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-sleek-accent group-hover:bg-sleek-accent group-hover:text-white transition-colors">
        <Bot size={24} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-sleek-text text-sm">IA Prédictive</h3>
        <p className="text-[11px] text-sleek-dim font-medium">Analyse des risques sanitaires</p>
      </div>
      <ChevronRight className="text-gray-300 group-hover:text-sleek-accent transition-colors" size={18} />
    </div>
  </section>
);

const TelemedicineView = ({ onBack, onDoctorClick }: { onBack: () => void, onDoctorClick: (name: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'appointments'>('doctors');
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      doctorId: 'dr-sarah',
      doctorName: 'Dr. Sarah',
      patientId: '1',
      patientName: 'Amadou Diallo',
      date: '2024-05-20',
      time: '10:30',
      status: 'Confirmé',
      type: 'Vidéo'
    },
    {
      id: 'apt-2',
      doctorId: 'dr-generic',
      doctorName: 'Dr. Moussa',
      patientId: '1',
      patientName: 'Amadou Diallo',
      date: '2024-05-22',
      time: '14:15',
      status: 'En attente',
      type: 'Chat'
    }
  ]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen pb-24 bg-gray-50"
    >
      <div className="bg-blue-600 px-6 pt-12 pb-10 rounded-b-[40px] shadow-lg text-white">
        <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors mb-6">
          <ChevronRight className="rotate-180" size={20} />
        </button>
        <h2 className="text-2xl font-black mb-1">Télé-soins Kadja</h2>
        <p className="text-blue-100 text-sm font-medium">Consultations virtuelles & suivi à distance</p>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-3xl p-1 flex shadow-lg mb-6">
          <button 
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'doctors' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'}`}
          >
            Médecins
          </button>
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'appointments' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'}`}
          >
            Mes Rendez-vous
          </button>
        </div>

        {activeTab === 'doctors' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spécialistes Disponibles</h3>
              <button className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                <ArrowUpDown size={10} /> Filtrer
              </button>
            </div>
            {MOCK_DOCTORS.map((doc) => (
              <div key={doc.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-all">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                  <img 
                    src={`https://picsum.photos/seed/${doc.id}/200/200`} 
                    alt={doc.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-black text-gray-900 text-sm">{doc.name}</h4>
                    <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-600 text-[9px] font-black">
                      <Star size={8} fill="currentColor" /> {doc.rating}
                    </div>
                  </div>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">{doc.specialty}</p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onDoctorClick(doc.name)}
                      className="text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      Profil
                    </button>
                    <button className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-sm hover:bg-blue-700 transition-all">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Planning des Consultations</h3>
            </div>
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <div key={apt.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        apt.type === 'Vidéo' ? 'bg-blue-50 text-blue-600' : 
                        apt.type === 'Chat' ? 'bg-emerald-50 text-emerald-600' : 
                        'bg-purple-50 text-purple-600'
                      }`}>
                        {apt.type === 'Vidéo' ? <Video size={24} /> : 
                         apt.type === 'Chat' ? <MessageCircle size={24} /> : 
                         <Users size={24} />}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-sm">{apt.doctorName}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{apt.type}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="text-[10px] text-blue-600 font-black">{apt.date} à {apt.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                      apt.status === 'Confirmé' ? 'bg-emerald-50 text-emerald-600' : 
                      apt.status === 'En attente' ? 'bg-orange-50 text-orange-600' : 
                      'bg-gray-50 text-gray-400'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className={`flex-1 py-3 text-[10px] font-black rounded-xl shadow-md transition-all ${
                      apt.status === 'Confirmé' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}>
                      {apt.type === 'Vidéo' ? "Rejoindre l'appel" : "Ouvrir le chat"}
                    </button>
                    <button className="px-4 py-3 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 hover:bg-red-50 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 rounded-[32px] p-10 text-center border-2 border-dashed border-gray-200">
                <Calendar className="mx-auto text-gray-300 mb-4" size={40} />
                <p className="text-sm text-gray-500 font-medium">Aucun rendez-vous prévu</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SoinsScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const innovations = [
    {
      specialty: 'Transformation Digitale',
      desc: 'Expertise en services numériques humanitaires, DHIS2, CommCare, et cybersécurité pour la transformation digitale en Afrique.',
      icon: Globe,
      color: 'bg-blue-500'
    },
    {
      specialty: 'Télésanté Autisme',
      desc: 'Solution de télésanté interopérable pour accompagner les familles et enfants atteints de troubles de l\'apprentissage (TSA) avec une méthodologie intégrée.',
      icon: Heart,
      color: 'bg-pink-500'
    },
    {
      specialty: 'Orientation Patient',
      desc: 'Orientation et conseil des patients basés sur les pathologies identifiées pour simplifier les démarches de santé.',
      icon: MapPin,
      color: 'bg-emerald-500'
    },
    {
      specialty: 'Santé Féminine',
      desc: 'Suivi du cycle menstruel validé par des spécialistes, incluant calculateur de règles, chatbot et communauté d\'écoute.',
      icon: Activity,
      color: 'bg-rose-500'
    },
    {
      specialty: 'Passeport Santé',
      desc: 'Passeport santé virtuel via QR CODE pour la gestion de dossiers médicaux numériques et rendez-vous hautement protégés.',
      icon: ShieldCheck,
      color: 'bg-slate-800'
    },
    {
      specialty: 'Santé Reproductive',
      desc: 'Plateforme numérique pour l\'égalité des sexes et l\'éducation sur la planification familiale en toute confidentialité.',
      icon: Lock,
      color: 'bg-purple-500'
    },
    {
      specialty: 'Gestion Hospitalière',
      desc: 'Logiciels hospitaliers complets pour la gestion des dossiers patients, paiements et crédits numériques.',
      icon: Building2,
      color: 'bg-indigo-600'
    },
    {
      specialty: 'Édition de Logiciels',
      desc: 'Solution de gestion hospitalière de bout en bout permettant une interaction fluide entre patients et professionnels.',
      icon: Database,
      color: 'bg-blue-600'
    },
    {
      specialty: 'Dermatologie IA',
      desc: 'Intelligence artificielle pour diagnostiquer les maladies de la peau via une simple photo et orientation vers des spécialistes.',
      icon: Microscope,
      color: 'bg-orange-500'
    },
    {
      specialty: 'Télémédecine 24/7',
      desc: 'Prise de rendez-vous, soins virtuels 24h/24, visites à domicile et accès sécurisé aux résultats de laboratoire.',
      icon: Smartphone,
      color: 'bg-blue-400'
    },
    {
      specialty: 'Santé Auditive',
      desc: 'Solutions cliniques numériques pour smartphones : tests auditifs, otoscope et tests de vision intégrés au cloud.',
      icon: BellRing,
      color: 'bg-yellow-500'
    },
    {
      specialty: 'Produits Dentaires',
      desc: 'Distribution de produits dentaires authentiques pour lutter contre les contrefaçons et sécuriser les soins.',
      icon: ShieldAlert,
      color: 'bg-cyan-600'
    },
    {
      specialty: 'Dépistage Malaria',
      desc: 'Test salivaire innovant pour détecter la malaria plus rapidement et sans prise de sang, accessible à tous.',
      icon: Syringe,
      color: 'bg-red-500'
    },
    {
      specialty: 'Distribution Pharma',
      desc: 'Distribution pharmaceutique digitale rendant les équipements médicaux accessibles via la vente en ligne.',
      icon: Truck,
      color: 'bg-emerald-600'
    },
    {
      specialty: 'Réseau de Médecins',
      desc: 'Plateforme d\'échange entre médecins pour collaborer en temps réel sur des cas cliniques et améliorer les décisions.',
      icon: Users,
      color: 'bg-blue-700'
    },
    {
      specialty: 'Ophtalmologie IA',
      desc: 'Examens oculaires via smartphone et géolocalisation des patients pour prévenir la cécité évitable.',
      icon: Eye,
      color: 'bg-teal-500'
    },
    {
      specialty: 'Assurance Mobile',
      desc: 'Microassurance mobile permettant l\'accès aux soins à moindre coût via prélèvement sur crédit de communication.',
      icon: CreditCard,
      color: 'bg-yellow-600'
    },
    {
      specialty: 'Anti-Contrefaçon',
      desc: 'Vérification de l\'authenticité des médicaments par simple SMS pour lutter contre les produits contrefaits.',
      icon: CheckCircle2,
      color: 'bg-emerald-500'
    },
    {
      specialty: 'Santé Infantile',
      desc: 'Suivi à distance des bébés via un carnet médical électronique pour faciliter le recours rapide aux soins.',
      icon: Bot,
      color: 'bg-sky-500'
    },
    {
      specialty: 'Surveillance Cardiaque',
      desc: 'Bracelet connecté surveillant les signaux biologiques en temps réel et alertant les secours en cas d\'anomalie.',
      icon: Activity,
      color: 'bg-red-600'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen pb-24 bg-gray-50"
    >
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white px-6 pt-12 pb-16 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10">
          <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
            KadjaCare - Réseau d'Innovation
          </span>
          <h1 className="text-3xl font-extrabold leading-tight mb-4">
            L'excellence médicale africaine unifiée.
          </h1>
          <p className="text-emerald-100 text-sm mb-8 leading-relaxed max-w-[280px]">
            Découvrez nos compétences intégrées pour une santé connectée, accessible et sécurisée.
          </p>
        </div>
      </div>

      <div className="px-6 -mt-8 space-y-8 relative z-20">
        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('Telemedicine')}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 flex flex-col gap-3 hover:border-blue-500 transition-all group"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smartphone size={20} />
            </div>
            <h3 className="text-xs font-black text-gray-900 uppercase">Télé-soins</h3>
            <p className="text-[10px] text-gray-400 font-medium">Consultations 24/7</p>
          </button>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 flex flex-col gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
              <Truck size={20} />
            </div>
            <h3 className="text-xs font-black text-gray-900 uppercase">Pharmacie</h3>
            <p className="text-[10px] text-gray-400 font-medium">Livraison Express</p>
          </div>
        </div>

        {/* Innovation Network List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-sleek-dim uppercase tracking-widest">Compétences Kadja</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{innovations.length} Services</span>
          </div>
          
          <div className="space-y-4">
            {innovations.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-100 flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-gray-900 mb-1">Kadja {item.specialty}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">Besoin d'aide ?</h3>
            <p className="text-slate-400 text-xs mb-6">Nos experts sont à votre écoute pour vous orienter.</p>
            <button className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl shadow-xl hover:bg-slate-100 transition-all">
              Contacter un conseiller
            </button>
          </div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </motion.div>
  );
};

const VaccinationScreen = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'enfant' | 'mere' | 'adulte'>('enfant');

  const pevEnfant = [
    { age: 'Naissance', vaccines: ['BCG', 'VPO 0'], desc: 'Tuberculose et Poliomyélite' },
    { age: '6 Semaines', vaccines: ['Penta 1', 'VPO 1', 'Pneumo 1', 'Rota 1'], desc: 'DTC-HepB-Hib, Polio, Pneumocoque, Rotavirus' },
    { age: '10 Semaines', vaccines: ['Penta 2', 'VPO 2', 'Pneumo 2', 'Rota 2'], desc: 'Rappels essentiels' },
    { age: '14 Semaines', vaccines: ['Penta 3', 'VPO 3', 'Pneumo 3', 'VPI'], desc: 'Protection renforcée' },
    { age: '9 Mois', vaccines: ['VAR 1', 'VAA', 'MenAfriVac'], desc: 'Rougeole, Fièvre Jaune, Méningite' },
    { age: '15 Mois', vaccines: ['VAR 2'], desc: 'Rappel Rougeole' },
  ];

  const pevMere = [
    { stage: 'VAT 1', timing: 'Premier contact', desc: 'Protection initiale contre le tétanos' },
    { stage: 'VAT 2', timing: '4 semaines après VAT 1', desc: 'Protection pour 3 ans' },
    { stage: 'VAT 3', timing: '6 mois après VAT 2', desc: 'Protection pour 5 ans' },
    { stage: 'VAT 4', timing: '1 an après VAT 3', desc: 'Protection pour 10 ans' },
    { stage: 'VAT 5', timing: '1 an après VAT 4', desc: 'Protection à vie' },
  ];

  const vaxAdulte = [
    { name: 'Fièvre Jaune', frequency: 'Tous les 10 ans', mandatory: true },
    { name: 'Méningite', frequency: 'Périodique (Épidémies)', mandatory: true },
    { name: 'Hépatite B', frequency: '3 doses (0, 1, 6 mois)', mandatory: false },
    { name: 'COVID-19', frequency: 'Selon protocole national', mandatory: true },
    { name: 'Fièvre Typhoïde', frequency: 'Tous les 3 ans', mandatory: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen pb-24 bg-gray-50"
    >
      <div className="bg-blue-700 text-white px-6 pt-12 pb-16 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10">
          <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors mb-6">
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <h1 className="text-3xl font-extrabold leading-tight mb-2">Programme de Vaccination</h1>
          <p className="text-blue-100 text-sm leading-relaxed max-w-[280px]">
            Suivez le calendrier PEV Tchad pour protéger votre famille.
          </p>
        </div>
      </div>

      <div className="px-6 -mt-8 space-y-6 relative z-20">
        {/* Tabs */}
        <div className="bg-white rounded-3xl p-1 flex shadow-lg">
          {(['enfant', 'mere', 'adulte'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'}`}
            >
              {tab === 'enfant' ? 'Enfant' : tab === 'mere' ? 'Mère' : 'Adulte'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'enfant' && (
            <>
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black text-sleek-dim uppercase tracking-widest">Calendrier PEV Tchad</h3>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">0 - 15 Mois</span>
              </div>
              <div className="space-y-3">
                {pevEnfant.map((item, i) => (
                  <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[8px] font-black uppercase leading-none mb-1">Âge</span>
                      <span className="text-xs font-black leading-none">{item.age.split(' ')[0]}</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.vaccines.map((v, vi) => (
                          <span key={vi} className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100">
                            {v}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'mere' && (
            <>
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black text-sleek-dim uppercase tracking-widest">Vaccination de la Femme (VAT)</h3>
                <span className="text-[9px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">Anti-Tétanique</span>
              </div>
              <div className="space-y-3">
                {pevMere.map((item, i) => (
                  <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-gray-900">{item.stage}</h4>
                      <p className="text-[10px] text-pink-500 font-bold mb-1">{item.timing}</p>
                      <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'adulte' && (
            <>
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black text-sleek-dim uppercase tracking-widest">Vaccins Adultes</h3>
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Obligatoires & Recommandés</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {vaxAdulte.map((item, i) => (
                  <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.mandatory ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
                        <Syringe size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-900">{item.name}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{item.frequency}</p>
                      </div>
                    </div>
                    {item.mandatory && (
                      <span className="text-[8px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Obligatoire</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-slate-900 rounded-[40px] p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-sm font-black mb-2">Besoin d'un carnet numérique ?</h3>
            <p className="text-slate-400 text-[10px] mb-4 leading-relaxed">
              Enregistrez vos vaccinations sur votre Passeport Santé Kadja pour ne jamais oublier un rappel.
            </p>
            <button className="bg-blue-600 text-white font-black px-6 py-3 rounded-xl text-[9px] uppercase tracking-widest shadow-lg">
              Activer mon carnet
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12">
            <ClipboardList size={80} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SSRScreen = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen pb-24 bg-gray-50"
    >
      {/* Header SSR */}
      <div className="bg-pink-600 text-white px-6 pt-12 pb-16 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              Santé Sexuelle & Reproductive
            </span>
            <button 
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${isPrivate ? 'bg-white text-pink-600 shadow-lg' : 'bg-white/20 text-white'}`}
            >
              <Lock size={14} />
              <span className="text-[10px] font-bold uppercase">{isPrivate ? 'Mode Privé' : 'Public'}</span>
            </button>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight mb-2">
            Votre santé, votre choix, votre liberté.
          </h1>
          <p className="text-pink-100 text-sm leading-relaxed max-w-[280px]">
            Accédez à des conseils confidentiels et des outils de suivi personnalisés.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-8 space-y-6 relative z-20">
        {/* Cycle Tracker Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Suivi de Cycle</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Prochaine période : 12 Mai</p>
              </div>
            </div>
            <button className="p-2 bg-gray-50 rounded-xl text-pink-500">
              <Plus size={20} />
            </button>
          </div>
          <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`min-w-[44px] h-16 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${i === 3 ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-100' : 'bg-white border-gray-100 text-gray-400'}`}>
                <span className="text-[10px] font-bold uppercase">{['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}</span>
                <span className="text-sm font-black">{10 + i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900 uppercase">Chat Expert</h4>
              <p className="text-[10px] text-gray-400">Anonyme & Gratuit</p>
            </div>
          </button>
          <button className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900 uppercase">Boutique</h4>
              <p className="text-[10px] text-gray-400">Livraison Discrète</p>
            </div>
          </button>
        </div>

        {/* Educational Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">Bibliothèque Santé</h3>
            <button className="text-pink-500 text-xs font-bold">Voir tout</button>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Tout savoir sur la contraception', category: 'Prévention', time: '5 min', icon: ShieldCheck },
              { title: 'Hygiène intime : les bons gestes', category: 'Conseils', time: '3 min', icon: Heart },
              { title: 'Planification familiale au Tchad', category: 'Société', time: '7 min', icon: Globe },
            ].map((article, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 group cursor-pointer hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors">
                  <article.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest">{article.category}</span>
                    <span className="text-[9px] text-gray-300">•</span>
                    <span className="text-[9px] text-gray-400 font-bold">{article.time} de lecture</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">{article.title}</h4>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AssuranceScreen = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col min-h-screen pb-24 bg-gray-50"
  >
    {/* Hero Section */}
    <div className="bg-blue-600 text-white px-6 pt-12 pb-16 rounded-b-[40px] shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
      <div className="relative z-10">
        <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
          Kadja Assurance Tchad
        </span>
        <h1 className="text-3xl font-extrabold leading-tight mb-4">
          Une assurance santé moderne pour vous et vos proches.
        </h1>
        <p className="text-blue-100 text-sm mb-8 leading-relaxed max-w-[280px]">
          Accédez aux meilleurs soins au Tchad avec une couverture complète et des services digitaux exclusifs.
        </p>
        <button className="bg-white text-blue-600 font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-105 transition-transform">
          Obtenir un devis
        </button>
      </div>
    </div>

    {/* Plans Section */}
    <section className="px-6 -mt-8 mb-12 relative z-20">
      <div className="grid grid-cols-1 gap-4">
        {[
          { 
            title: 'Individuel', 
            desc: 'Pour vous-même', 
            icon: Heart, 
            color: 'text-pink-500', 
            bg: 'bg-pink-50',
            features: ['Télé-consultation 24/7', 'Réseau national', 'Pharmacie incluse']
          },
          { 
            title: 'Famille', 
            desc: 'Couvrez toute la famille', 
            icon: Users, 
            color: 'text-blue-500', 
            bg: 'bg-blue-50',
            features: ['Jusqu\'à 6 membres', 'Soins pédiatriques', 'Maternité']
          },
          { 
            title: 'Entreprise', 
            desc: 'Pour vos employés', 
            icon: Building2, 
            color: 'text-indigo-500', 
            bg: 'bg-indigo-50',
            features: ['Gestion simplifiée', 'Check-ups annuels', 'Support dédié']
          },
        ].map((plan, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className={`${plan.bg} ${plan.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                <plan.icon size={24} />
              </div>
              <div>
                <h3 className="font-black text-gray-900">{plan.title}</h3>
                <p className="text-xs text-gray-500">{plan.desc}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle2 size={14} className="text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl border-2 border-gray-100 text-gray-900 font-bold text-sm hover:bg-gray-50 transition-colors">
              En savoir plus
            </button>
          </div>
        ))}
      </div>
    </section>

    {/* Why Us Section */}
    <section className="px-6 mb-12">
      <h2 className="text-xl font-black text-gray-900 mb-6">Pourquoi choisir Kadja ?</h2>
      <div className="space-y-6">
        {[
          { 
            title: 'Télé-médecine 24h/24', 
            desc: 'Parlez à un médecin en quelques minutes depuis votre téléphone.',
            icon: PhoneCall,
            color: 'bg-green-500'
          },
          { 
            title: 'Réseau de Qualité', 
            desc: 'Accès aux meilleures cliniques et hôpitaux partenaires au Tchad.',
            icon: Stethoscope,
            color: 'bg-blue-500'
          },
          { 
            title: 'Zéro Paperasse', 
            desc: 'Gérez vos remboursements et vos rendez-vous via l\'application.',
            icon: Database,
            color: 'bg-purple-500'
          },
        ].map((item, i) => (
          <div key={i} className="flex gap-4">
            <div className={`${item.color} w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-gray-200`}>
              <item.icon size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA Section */}
    <section className="px-6 mb-12">
      <div className="bg-indigo-600 rounded-[32px] p-8 text-white text-center">
        <h3 className="text-xl font-black mb-2">Prêt à nous rejoindre ?</h3>
        <p className="text-indigo-100 text-xs mb-6">Rejoignez des milliers de Tchadiens qui nous font confiance.</p>
        <button className="bg-white text-indigo-600 font-black px-8 py-4 rounded-2xl w-full">
          Commencer maintenant
        </button>
      </div>
    </section>
  </motion.div>
);

const BottomNav = ({ active, onChange }: { active: Screen, onChange: (s: Screen) => void }) => {
  const items: { id: Screen, icon: any }[] = [
    { id: 'Accueil', icon: Home },
    { id: 'Assurance', icon: ShieldCheck },
    { id: 'SSR', icon: Activity },
    { id: 'Soins', icon: Stethoscope },
    { id: 'Données', icon: Database },
    { id: 'SIS', icon: Globe },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-sleek-card border-t border-gray-200 px-2 py-2 pb-6 flex justify-around items-center z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center gap-1 relative flex-1 transition-colors duration-300 ${
              isActive ? 'text-sleek-accent' : 'text-sleek-dim'
            }`}
          >
            <motion.div
              animate={{ scale: isActive ? 1.1 : 1 }}
              className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}
            >
              <item.icon size={20} />
            </motion.div>
            <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              {item.id}
            </span>
            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -top-2 w-8 h-1 bg-sleek-accent rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

// --- Main App ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Accueil');
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('registeredAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    darkMode: false,
    language: 'Français'
  });
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const openConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentScreen('PatientDetail');
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
    setCurrentScreen('Accueil');
  };

  const handleAddConsultation = (patientId: string, consultation: Consultation) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          recentConsultations: [consultation, ...p.recentConsultations]
        };
      }
      return p;
    }));
    
    // Update selected patient to reflect changes immediately
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(prev => prev ? ({
        ...prev,
        recentConsultations: [consultation, ...prev.recentConsultations]
      }) : null);
    }
  };

  const handleDeletePatient = (id: string) => {
    openConfirmation(
      "Supprimer le patient ?",
      "Cette action est irréversible. Toutes les données médicales et consultations associées seront perdues.",
      () => {
        setPatients(prev => prev.filter(p => p.id !== id));
        if (selectedPatient?.id === id) {
          setCurrentScreen('Accueil');
          setSelectedPatient(null);
        }
      }
    );
  };

  const handleDeleteConsultation = (patientId: string, index: number) => {
    openConfirmation(
      "Supprimer la consultation ?",
      "Voulez-vous vraiment retirer cette consultation du dossier médical ?",
      () => {
        setPatients(prev => prev.map(p => {
          if (p.id === patientId) {
            const newConsultations = [...p.recentConsultations];
            newConsultations.splice(index, 1);
            return { ...p, recentConsultations: newConsultations };
          }
          return p;
        }));

        if (selectedPatient?.id === patientId) {
          setSelectedPatient(prev => {
            if (!prev) return null;
            const newConsultations = [...prev.recentConsultations];
            newConsultations.splice(index, 1);
            return { ...prev, recentConsultations: newConsultations };
          });
        }
      }
    );
  };

  const handleUpdateConsultation = (patientId: string, index: number, updated: Consultation) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const newConsultations = [...p.recentConsultations];
        newConsultations[index] = updated;
        return { ...p, recentConsultations: newConsultations };
      }
      return p;
    }));

    if (selectedPatient?.id === patientId) {
      setSelectedPatient(prev => {
        if (!prev) return null;
        const newConsultations = [...prev.recentConsultations];
        newConsultations[index] = updated;
        return { ...prev, recentConsultations: newConsultations };
      });
    }
  };

  const handleAddLabResult = (patientId: string, labResult: LabResult) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          labResults: [labResult, ...(p.labResults || [])]
        };
      }
      return p;
    }));
    
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(prev => prev ? ({
        ...prev,
        labResults: [labResult, ...(prev.labResults || [])]
      }) : null);
    }
  };

  const handleSortChange = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedPatients = [...patients].sort((a, b) => {
    let comparison = 0;
    if (sortKey === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortKey === 'age') {
      comparison = a.age - b.age;
    } else if (sortKey === 'registeredAt') {
      comparison = new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const notifications = patients.flatMap(p => 
    p.recentConsultations
      .filter(c => c.reminderDate)
      .map(c => ({
        patientName: p.name,
        date: c.reminderDate!,
        time: c.reminderTime || '08:00',
        reason: c.reason
      }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleDoctorClick = (name: string) => {
    const doctor = MOCK_DOCTORS.find(d => d.name === name) || {
      id: 'dr-generic',
      name: name,
      specialty: 'Spécialiste',
      location: 'Centre Médical Kadja, N\'Djamena',
      experience: '10 ans',
      patientsCount: 1500,
      rating: 4.8,
      bio: `Le ${name} est un praticien expérimenté au sein du réseau Kadja Health, dédié à fournir des soins de qualité supérieure à ses patients.`,
      availability: 'Sur rendez-vous'
    };
    setSelectedDoctor(doctor);
    setCurrentScreen('DoctorProfile');
  };

  const handleExportCSV = () => {
    const headers = ['Nom', 'Age', 'Genre', 'Groupe Sanguin', 'Email', 'Telephone', 'Statut', 'Derniere Consultation'];
    const rows = patients.map(p => {
      const lastConsultation = p.recentConsultations[0]?.date || 'Aucune';
      return [
        p.name,
        p.age,
        p.gender,
        p.bloodType,
        p.email || 'N/A',
        p.phone || 'N/A',
        p.status,
        lastConsultation
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `patients_kadja_health_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'AddPatient':
        return (
          <AddPatientForm 
            onAdd={handleAddPatient} 
            onBack={() => setCurrentScreen('Accueil')} 
          />
        );
      case 'PatientDetail':
        return selectedPatient ? (
          <PatientDetailView 
            patient={selectedPatient} 
            onBack={() => setCurrentScreen('Accueil')} 
            onAddConsultation={handleAddConsultation}
            onDeletePatient={handleDeletePatient}
            onDeleteConsultation={handleDeleteConsultation}
            onUpdateConsultation={handleUpdateConsultation}
            onAddLabResult={handleAddLabResult}
            onDoctorClick={handleDoctorClick}
          />
        ) : null;
      case 'DoctorProfile':
        return selectedDoctor ? (
          <DoctorProfile 
            doctor={selectedDoctor} 
            onBack={() => setCurrentScreen('PatientDetail')} 
          />
        ) : null;
      case 'StaffRegistration':
        return <StaffRegistrationForm onBack={() => setCurrentScreen('Accueil')} />;
      case 'SSR':
        return <SSRScreen />;
      case 'Soins':
        return <SoinsScreen onNavigate={setCurrentScreen} />;
      case 'Vaccination':
        return <VaccinationScreen onBack={() => setCurrentScreen('Accueil')} />;
      case 'Telemedicine':
        return (
          <TelemedicineView 
            onBack={() => setCurrentScreen('Soins')} 
            onDoctorClick={handleDoctorClick}
          />
        );
      case 'SIS':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-screen pb-20"
          >
            <div className="px-6 pt-8 pb-4 bg-white border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">SIS Dashboard</h2>
              <p className="text-xs text-gray-500">Système d'Information Sanitaire - Tchad</p>
            </div>
            <div className="flex-1 bg-gray-50 relative overflow-hidden">
              <iframe 
                src="https://sis.sante.gouv.td/sisr/dhis-web-dashboard/index.html#/start" 
                className="w-full h-full border-none"
                title="SIS Dashboard"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                <div className="text-center p-6">
                  <Globe className="mx-auto text-blue-500 mb-2" size={32} />
                  <p className="text-sm font-medium text-gray-700">Chargement du portail externe...</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'Assurance':
        return <AssuranceScreen />;
      case 'Profile':
        return (
          <ProfileScreen 
            onBack={() => setCurrentScreen('Accueil')} 
            settings={settings}
            onUpdateSettings={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
          />
        );
      case 'Accueil':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col"
          >
            <Header 
              onProfileClick={() => setCurrentScreen('Profile')} 
              onNotificationClick={() => setIsNotificationOpen(true)}
              notificationCount={notifications.length}
            />
            <SearchBar />
            <PatientStats 
              total={patients.length + 12450} 
              active={Math.floor(patients.length * 0.8) + 3870} 
              newCount={patients.length + 12} 
            />
            <div className="px-6 mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Patients Récents</h2>
            </div>
            <PatientList 
              patients={sortedPatients} 
              onSelect={handlePatientSelect} 
              onAdd={() => setCurrentScreen('AddPatient')}
              onDelete={handleDeletePatient}
              sortKey={sortKey}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onExport={handleExportCSV}
            />
            <ProfessionalSection onNavigate={setCurrentScreen} />
            <SolutionsSection onNavigate={setCurrentScreen} />
            <InnovationSection />
          </motion.div>
        );
      default:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 mb-4">
              {currentScreen === 'SSR' && <Activity size={40} />}
              {currentScreen === 'Soins' && <Stethoscope size={40} />}
              {currentScreen === 'Données' && <Database size={40} />}
              {currentScreen === 'ZLECAf' && <Globe size={40} />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentScreen}</h2>
            <p className="text-gray-500 max-w-xs">
              Cette section est en cours de développement pour la plateforme Kadja Health.
            </p>
            <button 
              onClick={() => setCurrentScreen('Accueil')}
              className="mt-8 px-6 py-3 bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all"
            >
              Retour à l'accueil
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 max-w-md mx-auto relative shadow-2xl overflow-x-hidden">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
      <BottomNav active={currentScreen} onChange={setCurrentScreen} />
      <NotificationCenter 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
      />
      <ConfirmationModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
