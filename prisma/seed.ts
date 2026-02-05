// Prisma 7: Set DATABASE_URL in process.env before importing
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local file explicitly
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const DATABASE_URL = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!DATABASE_URL) {
  console.error(
    "❌ Error: DATABASE_URL or DIRECT_URL environment variable is not set!"
  );
  process.exit(1);
}

import { PrismaClient, Transmission } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";

// Prisma 7: Use adapter for Postgres connection
const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Supabase client for auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Supabase environment variables are not set!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log("🌱 Starting comprehensive seed...\n");

  // ============================================
  // 1. COUNTRY & CITIES
  // ============================================
  console.log("📍 Creating countries and cities...");
  const pakistan = await prisma.country.upsert({
    where: { code: "PK" },
    update: {},
    create: {
      name: "Pakistan",
      slug: "pakistan",
      code: "PK",
      isActive: true,
    },
  });

  // Slug from display name: lowercase, spaces to hyphens, parentheses to hyphen (e.g. "Nawabshah (Benazirabad)" → "nawabshah-benazirabad")
  const toSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s*\(\s*/g, "-")
      .replace(/\s*\)\s*/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const cityNames = [
    "Abbottabad",
    "Ahmedpur East",
    "Arif Wala",
    "Astore",
    "Attock",
    "Awaran",
    "Badin",
    "Bagh",
    "Bahawalnagar",
    "Bahawalpur",
    "Bajaur Agency",
    "Bannu",
    "Bat Khela",
    "Battagram",
    "Besham",
    "Bhakkar",
    "Bhalwal",
    "Buner",
    "Burewala",
    "Chakwal",
    "Chaman",
    "Charsadda",
    "Chichawatni",
    "Chiniot",
    "Chishtian",
    "Dadu",
    "Daska",
    "Dera Ghazi Khan",
    "Dera Ismail Khan",
    "Dera Murad Jamali",
    "Dipalpur",
    "Faisalabad",
    "Farooqabad",
    "Ferozwala",
    "Ghotki",
    "Gojra",
    "Gujar Khan",
    "Gujranwala",
    "Gujrat",
    "Hafizabad",
    "Hangu",
    "Haroonabad",
    "Hasilpur",
    "Haveli Lakha",
    "Hub",
    "Hyderabad",
    "Islamabad",
    "Jacobabad",
    "Jalalpur Jattan",
    "Jampur",
    "Jaranwala",
    "Jatoi",
    "Jauharabad",
    "Jhang",
    "Jhelum",
    "Kabal",
    "Kamalia",
    "Kamber Ali Khan",
    "Kamoke",
    "Karachi",
    "Karak",
    "Kasur",
    "Khairpur",
    "Khanewal",
    "Khanpur",
    "Kharian",
    "Khushab",
    "Khuzdar",
    "Kohat",
    "Kot Abdul Malik",
    "Kot Addu",
    "Kot Radha Kishan",
    "Kotri",
    "Kulachi",
    "Lahore",
    "Lakki Marwat",
    "Lala Musa",
    "Larkana",
    "Layyah",
    "Lodhran",
    "Mailsi",
    "Mandi Bahauddin",
    "Mansehra",
    "Mardan",
    "Mian Channu",
    "Mianwali",
    "Mingora",
    "Mirpur",
    "Mirpur Khas",
    "Multan",
    "Muridke",
    "Muzaffarabad",
    "Muzaffargarh",
    "Narowal",
    "Nawabshah (Benazirabad)",
    "Nowshera",
    "Okara",
    "Pakpattan",
    "Panjgur",
    "Pasrur",
    "Pattoki",
    "Peshawar",
    "Phool Nagar",
    "Pishin",
    "Quetta",
    "Rahim Yar Khan",
    "Rawalpindi",
    "Renala Khurd",
    "Sadiqabad",
    "Sahiwal",
    "Sambrial",
    "Samundri",
    "Sangla Hill",
    "Sargodha",
    "Shabqadar",
    "Shahdadkot",
    "Shahdadpur",
    "Shakargarh",
    "Sheikhupura",
    "Shikarpur",
    "Shujabad",
    "Sialkot",
    "Sukkur",
    "Swabi",
    "Swat",
    "Tando Adam",
    "Tando Allahyar",
    "Tando Muhammad Khan",
    "Taunsa",
    "Taxila",
    "Timergara",
    "Tordher",
    "Turbat",
    "Umerkot",
    "Upper Dir",
    "Vehari",
    "Wah Cantonment",
    "Zaida",
    "Ziarat",
    "Murree",
    "Skardu",
    "Hunza",
    "Gilgit",
    "Gwadar",
  ];

  const cityRecords: { id: string; name: string; slug: string }[] = [];
  for (const name of cityNames) {
    const slug = toSlug(name);
    const cityRecord = await prisma.city.upsert({
      where: { slug },
      update: { name },
      create: {
        name,
        slug,
        province: null,
        countryId: pakistan.id,
        isActive: true,
      },
    });
    cityRecords.push(cityRecord);
    console.log(`  ✅ ${name}`);
  }

  // ============================================
  // 2. TOWNS
  // ============================================
  console.log("\n🏘️  Creating towns...");
  const townsData = [
    // Karachi towns
    { name: "Clifton", citySlug: "karachi" },
    { name: "DHA", citySlug: "karachi" },
    { name: "Gulshan-e-Iqbal", citySlug: "karachi" },
    { name: "PECHS", citySlug: "karachi" },
    { name: "Defence", citySlug: "karachi" },
    { name: "Gulistan-e-Johar", citySlug: "karachi" },
    { name: "Malir", citySlug: "karachi" },
    // Lahore towns
    { name: "Gulberg", citySlug: "lahore" },
    { name: "DHA Phase 5", citySlug: "lahore" },
    { name: "Model Town", citySlug: "lahore" },
    { name: "Johar Town", citySlug: "lahore" },
    { name: "Bahria Town", citySlug: "lahore" },
    { name: "Wapda Town", citySlug: "lahore" },
    { name: "Ferozepur Road", citySlug: "lahore" },
    { name: "Aibak Block", citySlug: "lahore" },
    { name: "Ahmed Block", citySlug: "lahore" },
    { name: "Airline Society", citySlug: "lahore" },
    { name: "Airport Road", citySlug: "lahore" },
    { name: "Ali Block", citySlug: "lahore" },
    { name: "Ali Park", citySlug: "lahore" },
    { name: "Allama Iqbal Medical College", citySlug: "lahore" },
    { name: "Allama Iqbal Town", citySlug: "lahore" },
    { name: "Alpha Co Operative", citySlug: "lahore" },
    { name: "Amin Park", citySlug: "lahore" },
    { name: "Anar Kali", citySlug: "lahore" },
    { name: "Architects Engineers Society", citySlug: "lahore" },
    { name: "Army Housing Society", citySlug: "lahore" },
    { name: "Asif Block", citySlug: "lahore" },
    { name: "Askari Colony", citySlug: "lahore" },
    { name: "Askrai Villa", citySlug: "lahore" },
    { name: "Atta Turk Block", citySlug: "lahore" },
    { name: "Aurangzeb Block", citySlug: "lahore" },
    { name: "Awan Market", citySlug: "lahore" },
    { name: "Awan Town", citySlug: "lahore" },
    { name: "Baba Farid Colony", citySlug: "lahore" },
    { name: "Babar Block", citySlug: "lahore" },
    { name: "Badami Bagh", citySlug: "lahore" },
    { name: "Badar Block", citySlug: "lahore" },
    { name: "Baghban Pura", citySlug: "lahore" },
    { name: "Bagrian", citySlug: "lahore" },
    { name: "Band Road", citySlug: "lahore" },
    { name: "Barki Road", citySlug: "lahore" },
    { name: "Bedian Road", citySlug: "lahore" },
    { name: "Bibi Pak Daman", citySlug: "lahore" },
    { name: "Bilal Gang", citySlug: "lahore" },
    { name: "Bilal Park", citySlug: "lahore" },
    { name: "Blue World City", citySlug: "lahore" },
    { name: "Bostan Colony", citySlug: "lahore" },
    { name: "Bridge Colony", citySlug: "lahore" },
    { name: "Burj Colony", citySlug: "lahore" },
    { name: "C.M.A. Colony", citySlug: "lahore" },
    { name: "Canal Bank", citySlug: "lahore" },
    { name: "Canal Breeze", citySlug: "lahore" },
    { name: "Canal Garden", citySlug: "lahore" },
    { name: "Canal Park Society", citySlug: "lahore" },
    { name: "Canal Road", citySlug: "lahore" },
    { name: "Canal View Colony", citySlug: "lahore" },
    { name: "Cantt", citySlug: "lahore" },
    { name: "Cavalry Ground", citySlug: "lahore" },
    { name: "Chachowali", citySlug: "lahore" },
    { name: "Chararrd Village", citySlug: "lahore" },
    { name: "Chenab Block", citySlug: "lahore" },
    { name: "Chungi Amer Sadhu", citySlug: "lahore" },
    { name: "Civic Center", citySlug: "lahore" },
    { name: "College Block", citySlug: "lahore" },
    { name: "D.H.A.", citySlug: "lahore" },
    { name: "Darbar Gurreh Shah", citySlug: "lahore" },
    { name: "Darbar Pir Makki", citySlug: "lahore" },
    { name: "Daroghawala", citySlug: "lahore" },
    { name: "Data Nagar", citySlug: "lahore" },
    { name: "Davis Road", citySlug: "lahore" },
    { name: "Defense", citySlug: "lahore" },
    { name: "Dharampura", citySlug: "lahore" },
    { name: "Doctors Society", citySlug: "lahore" },
    { name: "Eden Avenue", citySlug: "lahore" },
    { name: "Eden Canal Villas", citySlug: "lahore" },
    { name: "Eden Homes", citySlug: "lahore" },
    { name: "Eden View", citySlug: "lahore" },
    { name: "Education Town", citySlug: "lahore" },
    { name: "EME DHA Society", citySlug: "lahore" },
    { name: "Engineer Cooperative Society", citySlug: "lahore" },
    { name: "F.C. College", citySlug: "lahore" },
    { name: "Falcon Complex", citySlug: "lahore" },
    { name: "Faruque Ganj", citySlug: "lahore" },
    { name: "Faisal Park", citySlug: "lahore" },
    { name: "Faisal Town", citySlug: "lahore" },
    { name: "Ferozpur Road", citySlug: "lahore" },
    { name: "Firozpur Road", citySlug: "lahore" },
    { name: "Fort Villas", citySlug: "lahore" },
    { name: "Fortress Stadium", citySlug: "lahore" },
    { name: "Fransisi Town", citySlug: "lahore" },
    { name: "Garden Block", citySlug: "lahore" },
    { name: "Garden Town", citySlug: "lahore" },
    { name: "Garhi Shahu", citySlug: "lahore" },
    { name: "Gawal Mandi", citySlug: "lahore" },
    { name: "Ghazi Road", citySlug: "lahore" },
    { name: "Ghous Azan Colony", citySlug: "lahore" },
    { name: "Ghousia Colony", citySlug: "lahore" },
    { name: "Gohawa", citySlug: "lahore" },
    { name: "G.O.R.", citySlug: "lahore" },
    { name: "Gopal Nagar", citySlug: "lahore" },
    { name: "Gor", citySlug: "lahore" },
    { name: "Green Park", citySlug: "lahore" },
    { name: "Green Town", citySlug: "lahore" },
    { name: "Gulbahar Colony", citySlug: "lahore" },
    { name: "Gulshan Block", citySlug: "lahore" },
    { name: "Gulshan E Ravi", citySlug: "lahore" },
    { name: "Hadiara", citySlug: "lahore" },
    { name: "Hamdard Chowk", citySlug: "lahore" },
    { name: "Harbanspura", citySlug: "lahore" },
    { name: "Herbuns Pura", citySlug: "lahore" },
    { name: "Huma Block", citySlug: "lahore" },
    { name: "Hunza Block", citySlug: "lahore" },
    { name: "Ichhra", citySlug: "lahore" },
    { name: "Infantry Road", citySlug: "lahore" },
    { name: "Iqbal Ave Housing Society", citySlug: "lahore" },
    { name: "Iqbal Avenue", citySlug: "lahore" },
    { name: "Islam Pura", citySlug: "lahore" },
    { name: "Ittehad Colony", citySlug: "lahore" },
    { name: "Izmir Town", citySlug: "lahore" },
    { name: "J.D.A.", citySlug: "lahore" },
    { name: "Jail Road", citySlug: "lahore" },
    { name: "Jehanzeb Block", citySlug: "lahore" },
    { name: "Jinnah Hospital", citySlug: "lahore" },
    { name: "Jubli Town", citySlug: "lahore" },
    { name: "K.B. Society", citySlug: "lahore" },
    { name: "Kainchi", citySlug: "lahore" },
    { name: "Kamran Block", citySlug: "lahore" },
    { name: "Karim Block", citySlug: "lahore" },
    { name: "Karim Park", citySlug: "lahore" },
    { name: "Khayaban-e-Amin", citySlug: "lahore" },
    { name: "Khuda Buksh Colony", citySlug: "lahore" },
    { name: "Khudad Town", citySlug: "lahore" },
    { name: "Khursheed Alam Road", citySlug: "lahore" },
    { name: "Kot Lakhpat", citySlug: "lahore" },
    { name: "Lakshmi Chowk", citySlug: "lahore" },
    { name: "Lalzar Colony", citySlug: "lahore" },
    { name: "Lawrence Road", citySlug: "lahore" },
    { name: "L.D.A. Avenue", citySlug: "lahore" },
    { name: "L.D.A. Colony", citySlug: "lahore" },
    { name: "Lidhar", citySlug: "lahore" },
    { name: "LUMS", citySlug: "lahore" },
    { name: "M.M. Alam Road", citySlug: "lahore" },
    { name: "Madina Colony", citySlug: "lahore" },
    { name: "Mahmood Booty Ring Road", citySlug: "lahore" },
    { name: "Main Gulberg Boulevard", citySlug: "lahore" },
    { name: "Main Khayaban Road", citySlug: "lahore" },
    { name: "Main Mir Colony", citySlug: "lahore" },
    { name: "Makkah Colony", citySlug: "lahore" },
    { name: "Mamdoot Block", citySlug: "lahore" },
    { name: "Maraghzar Colony", citySlug: "lahore" },
    { name: "Mayo Hospital", citySlug: "lahore" },
    { name: "Mazang", citySlug: "lahore" },
    { name: "Mehran Block", citySlug: "lahore" },
    { name: "Misri Shah", citySlug: "lahore" },
    { name: "Moon Market", citySlug: "lahore" },
    { name: "Mughal Pura", citySlug: "lahore" },
    { name: "Muhafiz Town", citySlug: "lahore" },
    { name: "Munir Road", citySlug: "lahore" },
    { name: "Muslim Town", citySlug: "lahore" },
    { name: "Mustafa Bad", citySlug: "lahore" },
    { name: "Mustafa Park", citySlug: "lahore" },
    { name: "Mustafa Town", citySlug: "lahore" },
    { name: "Nabi Pura", citySlug: "lahore" },
    { name: "Nargis Block", citySlug: "lahore" },
    { name: "Nasheman Colony", citySlug: "lahore" },
    { name: "Nasheman Iqbal Housing Scheme", citySlug: "lahore" },
    { name: "Nespak Society", citySlug: "lahore" },
    { name: "New Garden Town", citySlug: "lahore" },
    { name: "New Mustafa Colony", citySlug: "lahore" },
    { name: "New PAF Colony", citySlug: "lahore" },
    { name: "Nisar Colony", citySlug: "lahore" },
    { name: "Nishtar Block", citySlug: "lahore" },
    { name: "Nishtar Colony", citySlug: "lahore" },
    { name: "Nova City", citySlug: "lahore" },
    { name: "Officers Colony", citySlug: "lahore" },
    { name: "OPF Colony", citySlug: "lahore" },
    { name: "OPF Housing Scheme", citySlug: "lahore" },
    { name: "P.A.F. Colony", citySlug: "lahore" },
    { name: "P.C.S.I.R. Housing Scheme", citySlug: "lahore" },
    { name: "P.C.S.I.R. Housing Society", citySlug: "lahore" },
    { name: "Pak Block", citySlug: "lahore" },
    { name: "Paragon City", citySlug: "lahore" },
    { name: "Park View City", citySlug: "lahore" },
    { name: "PASCO Housing Society", citySlug: "lahore" },
    { name: "Peco Road", citySlug: "lahore" },
    { name: "P.I.A. Society", citySlug: "lahore" },
    { name: "Premier Energy", citySlug: "lahore" },
    { name: "Punjab Govt Employs Cooperative Society", citySlug: "lahore" },
    { name: "Punjab Society Near DHA", citySlug: "lahore" },
    { name: "Punjab University", citySlug: "lahore" },
    { name: "Qila Gujar Singh", citySlug: "lahore" },
    { name: "Qila Lakshan Singh", citySlug: "lahore" },
    { name: "Quaid-e-Azam Industrial Estate", citySlug: "lahore" },
    { name: "R.A. Bazaar", citySlug: "lahore" },
    { name: "Race Course Park", citySlug: "lahore" },
    { name: "Race Course Town", citySlug: "lahore" },
    { name: "Rachna Block", citySlug: "lahore" },
    { name: "Railway Housing Society", citySlug: "lahore" },
    { name: "Raiwind Road", citySlug: "lahore" },
    { name: "Ram Garh", citySlug: "lahore" },
    { name: "Rang Mehal", citySlug: "lahore" },
    { name: "Ravi Block", citySlug: "lahore" },
    { name: "Ravi Road", citySlug: "lahore" },
    { name: "Raza Block", citySlug: "lahore" },
    { name: "Rehman Garden", citySlug: "lahore" },
    { name: "Revenue Society", citySlug: "lahore" },
    { name: "Riwaz Garden", citySlug: "lahore" },
    { name: "S.M.C.H.S.", citySlug: "lahore" },
    { name: "Saddar", citySlug: "lahore" },
    { name: "Saint John Park", citySlug: "lahore" },
    { name: "Salamatpura", citySlug: "lahore" },
    { name: "Samanabad", citySlug: "lahore" },
    { name: "Samia Town", citySlug: "lahore" },
    { name: "Sanat Nagar", citySlug: "lahore" },
    { name: "Sarwar Road", citySlug: "lahore" },
    { name: "Sarshar Town", citySlug: "lahore" },
    { name: "Shabir Town", citySlug: "lahore" },
    { name: "Shad Bagh", citySlug: "lahore" },
    { name: "Shadman Colony", citySlug: "lahore" },
    { name: "Shahtaj Colony", citySlug: "lahore" },
    { name: "Shaikh Zayed Hospital", citySlug: "lahore" },
    { name: "Shalimar Link Road", citySlug: "lahore" },
    { name: "Shalimar Town", citySlug: "lahore" },
    { name: "Shama Colony", citySlug: "lahore" },
    { name: "Shaukat Khanum Hospital", citySlug: "lahore" },
    { name: "Shersha Block", citySlug: "lahore" },
    { name: "Sikandar Block", citySlug: "lahore" },
    { name: "Star Town", citySlug: "lahore" },
    { name: "State Life Society", citySlug: "lahore" },
    { name: "Sui Gas Society", citySlug: "lahore" },
    { name: "Sukh Chain Society", citySlug: "lahore" },
    { name: "Super Town", citySlug: "lahore" },
    { name: "Sutlej Block", citySlug: "lahore" },
    { name: "Tariq Block", citySlug: "lahore" },
    { name: "Tariq Garden", citySlug: "lahore" },
    { name: "Tech Society", citySlug: "lahore" },
    { name: "Temple Road", citySlug: "lahore" },
    { name: "Thokar Niaz Baig", citySlug: "lahore" },
    { name: "Tipu Block", citySlug: "lahore" },
    { name: "Tricon Valley", citySlug: "lahore" },
    { name: "Tufail Road", citySlug: "lahore" },
    { name: "U.C.P.", citySlug: "lahore" },
    { name: "Umer Block", citySlug: "lahore" },
    { name: "University of Lahore", citySlug: "lahore" },
    { name: "Upper Mall Scheme", citySlug: "lahore" },
    { name: "Usman Block", citySlug: "lahore" },
    { name: "Usman Ganj", citySlug: "lahore" },
    { name: "Valencia Town", citySlug: "lahore" },
    { name: "Vision City", citySlug: "lahore" },
    { name: "Wafaqi Colony", citySlug: "lahore" },
    { name: "Wahdat Colony", citySlug: "lahore" },
    { name: "Walton Road", citySlug: "lahore" },
    { name: "Wapda Colony", citySlug: "lahore" },
    { name: "Wapda House", citySlug: "lahore" },
    { name: "West Wood Colony", citySlug: "lahore" },
    { name: "Youhna Bad", citySlug: "lahore" },
    { name: "Zaman Colony", citySlug: "lahore" },
    { name: "Zeenat Block", citySlug: "lahore" },
    // Islamabad towns
    { name: "F-7", citySlug: "islamabad" },
    { name: "F-8", citySlug: "islamabad" },
    { name: "G-11", citySlug: "islamabad" },
    { name: "DHA Phase 2", citySlug: "islamabad" },
    { name: "E-11", citySlug: "islamabad" },
    { name: "I-8", citySlug: "islamabad" },
    { name: "Blue Area", citySlug: "islamabad" },
    // Rawalpindi towns
    { name: "Bahria Town", citySlug: "rawalpindi" },
    { name: "DHA Phase 1", citySlug: "rawalpindi" },
    { name: "Chaklala", citySlug: "rawalpindi" },
    { name: "Cantt", citySlug: "rawalpindi" },
    // Faisalabad towns
    { name: "D Ground", citySlug: "faisalabad" },
    { name: "Satiana Road", citySlug: "faisalabad" },
    { name: "Jaranwala Road", citySlug: "faisalabad" },
    // Multan towns
    { name: "Cantt", citySlug: "multan" },
    { name: "Gulgasht", citySlug: "multan" },
    { name: "Bosan Road", citySlug: "multan" },
    // Peshawar towns
    { name: "Hayatabad", citySlug: "peshawar" },
    { name: "University Town", citySlug: "peshawar" },
    { name: "Cantt", citySlug: "peshawar" },
    // Quetta towns
    { name: "Cantt", citySlug: "quetta" },
    { name: "Jinnah Town", citySlug: "quetta" },
    // Gujranwala towns
    { name: "Cantt", citySlug: "gujranwala" },
    { name: "Model Town", citySlug: "gujranwala" },
    // Sialkot towns
    { name: "Cantt", citySlug: "sialkot" },
    { name: "Model Town", citySlug: "sialkot" },
    // Sargodha towns
    { name: "Cantt", citySlug: "sargodha" },
    { name: "Model Town", citySlug: "sargodha" },
    // Bahawalpur towns
    { name: "Cantt", citySlug: "bahawalpur" },
    { name: "Model Town", citySlug: "bahawalpur" },
  ];

  const townRecords = [];
  for (const town of townsData) {
    const city = cityRecords.find((c) => c.slug === town.citySlug);
    if (!city) continue;

    const townSlug = `${town.citySlug}-${town.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    const townRecord = await prisma.town.upsert({
      where: {
        slug_cityId: {
          slug: townSlug,
          cityId: city.id,
        },
      },
      update: {},
      create: {
        name: town.name,
        slug: townSlug,
        cityId: city.id,
        isActive: true,
      },
    });
    townRecords.push(townRecord);
    console.log(`  ✅ ${town.name} (${city.name})`);
  }

  // ============================================
  // 2b. VEHICLE CATEGORIES (top-level taxonomy)
  // ============================================
  console.log("\n📂 Creating vehicle categories...");
  const categories = [
    { name: "Car", slug: "car" },
    { name: "SUV", slug: "suv" },
    { name: "Van", slug: "van" },
    { name: "Bus", slug: "bus" },
    { name: "Pickup", slug: "pickup" },
    { name: "Truck", slug: "truck" },
    { name: "Luxury", slug: "luxury" },
  ];
  const categoryRecords: { id: string; name: string; slug: string }[] = [];
  for (const cat of categories) {
    const rec = await prisma.vehicleCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug },
    });
    categoryRecords.push(rec);
    console.log(`  ✅ ${cat.name}`);
  }
  const getCategoryId = (slug: string) =>
    categoryRecords.find((c) => c.slug === slug)?.id;

  // ============================================
  // 3. VEHICLE TYPES (with categoryId)
  // ============================================
  console.log("\n🚙 Creating vehicle types...");
  // Legacy types (for backward compat with existing vehicles) – assign categoryId
  const legacyTypes = [
    {
      name: "Cars",
      slug: "cars",
      categorySlug: "car",
      description: "Sedan, Corolla, Civic and more",
    },
    {
      name: "Hiace",
      slug: "hiace",
      categorySlug: "van",
      description: "Toyota Hiace vans for group travel",
    },
    {
      name: "Vans",
      slug: "vans",
      categorySlug: "van",
      description: "Passenger and cargo vans",
    },
    {
      name: "Coaster",
      slug: "coaster",
      categorySlug: "bus",
      description: "Toyota Coaster buses",
    },
    {
      name: "Buses",
      slug: "buses",
      categorySlug: "bus",
      description: "Large buses for group travel",
    },
    {
      name: "Wedding Cars",
      slug: "wedding-cars",
      categorySlug: "luxury",
      description: "Luxury cars for weddings",
    },
  ];
  const vehicleTypeRecords: {
    id: string;
    slug: string;
    categoryId: string | null;
  }[] = [];
  for (const vt of legacyTypes) {
    const categoryId = getCategoryId(vt.categorySlug) ?? null;
    const existing = await prisma.vehicleType.findFirst({
      where: { slug: vt.slug },
    });
    let rec;
    if (existing) {
      rec = await prisma.vehicleType.update({
        where: { id: existing.id },
        data: { categoryId, name: vt.name, description: vt.description },
      });
    } else {
      rec = await prisma.vehicleType.create({
        data: {
          name: vt.name,
          slug: vt.slug,
          categoryId,
          description: vt.description,
          isActive: true,
        },
      });
    }
    vehicleTypeRecords.push(rec);
    console.log(`  ✅ ${vt.name}`);
  }
  // Full taxonomy: sub-types per category (Car → Hatchback, Sedan, etc.)
  const taxonomyTypes: { name: string; slug: string; categorySlug: string }[] =
    [
      { name: "Hatchback", slug: "hatchback", categorySlug: "car" },
      { name: "Sedan", slug: "sedan", categorySlug: "car" },
      { name: "Compact", slug: "compact", categorySlug: "car" },
      { name: "Executive", slug: "executive", categorySlug: "car" },
      { name: "Hybrid", slug: "hybrid", categorySlug: "car" },
      { name: "Compact SUV", slug: "compact-suv", categorySlug: "suv" },
      { name: "Full-Size SUV", slug: "full-size-suv", categorySlug: "suv" },
      { name: "4x4 SUV", slug: "4x4-suv", categorySlug: "suv" },
      { name: "Mini Van", slug: "mini-van", categorySlug: "van" },
      { name: "Passenger Van", slug: "passenger-van", categorySlug: "van" },
      { name: "Cargo Van", slug: "cargo-van", categorySlug: "van" },
      { name: "Coaster", slug: "coaster-bus", categorySlug: "bus" },
      { name: "Mini Bus", slug: "mini-bus", categorySlug: "bus" },
      { name: "Luxury Bus", slug: "luxury-bus", categorySlug: "bus" },
      { name: "Single Cabin", slug: "single-cabin", categorySlug: "pickup" },
      { name: "Double Cabin", slug: "double-cabin", categorySlug: "pickup" },
      { name: "4x4 Pickup", slug: "4x4-pickup", categorySlug: "pickup" },
      { name: "Small Truck", slug: "small-truck", categorySlug: "truck" },
      { name: "Medium Truck", slug: "medium-truck", categorySlug: "truck" },
      { name: "Loader", slug: "loader", categorySlug: "truck" },
      { name: "Luxury Sedan", slug: "luxury-sedan", categorySlug: "luxury" },
      { name: "Luxury SUV", slug: "luxury-suv", categorySlug: "luxury" },
      { name: "Wedding Car", slug: "wedding-car", categorySlug: "luxury" },
    ];
  for (const tt of taxonomyTypes) {
    const categoryId = getCategoryId(tt.categorySlug);
    if (!categoryId) continue;
    const existing = await prisma.vehicleType.findFirst({
      where: { slug: tt.slug, categoryId },
    });
    if (!existing) {
      const rec = await prisma.vehicleType.create({
        data: {
          name: tt.name,
          slug: tt.slug,
          categoryId,
          isActive: true,
        },
      });
      vehicleTypeRecords.push(rec);
      console.log(`  ✅ ${tt.name} (${tt.categorySlug})`);
    }
  }

  // ============================================
  // 4. VEHICLE BRANDS
  // ============================================
  console.log("\n🚗 Creating vehicle brands...");
  const brands = [
    { name: "Toyota", slug: "toyota" },
    { name: "Honda", slug: "honda" },
    { name: "Suzuki", slug: "suzuki" },
    { name: "Nissan", slug: "nissan" },
    { name: "Hyundai", slug: "hyundai" },
    { name: "Kia", slug: "kia" },
    { name: "Daihatsu", slug: "daihatsu" },
    { name: "Haval", slug: "haval" },
    { name: "Isuzu", slug: "isuzu" },
    { name: "Mercedes-Benz", slug: "mercedes-benz" },
    { name: "BMW", slug: "bmw" },
    { name: "Audi", slug: "audi" },
    { name: "Volkswagen", slug: "volkswagen" },
    { name: "Ford", slug: "ford" },
    { name: "Chevrolet", slug: "chevrolet" },
    { name: "Mazda", slug: "mazda" },
    { name: "Mitsubishi", slug: "mitsubishi" },
    { name: "Hino", slug: "hino" },
    { name: "Daewoo", slug: "daewoo" },
  ];

  const brandRecords = [];
  for (const brand of brands) {
    const brandRecord = await prisma.vehicleBrand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: {
        name: brand.name,
        slug: brand.slug,
        isActive: true,
      },
    });
    brandRecords.push(brandRecord);
    console.log(`  ✅ ${brand.name}`);
  }

  // ============================================
  // 5. VEHICLE MODELS
  // ============================================
  console.log("\n🚘 Creating vehicle models...");
  const models = [
    // Toyota
    { name: "Corolla", brand: "toyota" },
    { name: "Camry", brand: "toyota" },
    { name: "Land Cruiser", brand: "toyota" },
    { name: "Hilux", brand: "toyota" },
    { name: "Prius", brand: "toyota" },

    { name: "Vitz", brand: "toyota" },
    { name: "Yaris", brand: "toyota" },
    { name: "Premio", brand: "toyota" },
    { name: "Hiace Grand Cabin", brand: "toyota" },
    { name: "Hiace High Roof", brand: "toyota" },
    { name: "Coaster Saloon", brand: "toyota" },
    // Honda
    { name: "Civic", brand: "honda" },
    { name: "City", brand: "honda" },
    { name: "CR-V", brand: "honda" },
    { name: "Accord", brand: "honda" },
    // Suzuki
    { name: "Mehran", brand: "suzuki" },
    { name: "Cultus", brand: "suzuki" },
    { name: "Swift", brand: "suzuki" },
    { name: "Alto", brand: "suzuki" },
    { name: "Wagon R", brand: "suzuki" },
    { name: "Bolan", brand: "suzuki" },
    // Nissan
    { name: "Sunny", brand: "nissan" },
    { name: "X-Trail", brand: "nissan" },
    { name: "Sentra", brand: "nissan" },
    { name: "Caravan", brand: "nissan" },
    // Hyundai
    { name: "Elantra", brand: "hyundai" },
    { name: "Tucson", brand: "hyundai" },
    { name: "Sonata", brand: "hyundai" },
    { name: "Accent", brand: "hyundai" },
    // Kia
    { name: "Sportage", brand: "kia" },
    { name: "Picanto", brand: "kia" },
    { name: "Cerato", brand: "kia" },
    // Mitsubishi
    { name: "Pajero", brand: "mitsubishi" },
    // Hino
    { name: "Bus", brand: "hino" },
    // Isuzu
    { name: "Bus", brand: "isuzu" },
    { name: "D-Max", brand: "isuzu" },
    // Daewoo
    { name: "Bus", brand: "daewoo" },
    // Luxury
    { name: "C-Class", brand: "mercedes-benz" },

    { name: "E-Class", brand: "mercedes-benz" },
    { name: "S-Class", brand: "mercedes-benz" },
    { name: "3 Series", brand: "bmw" },

    { name: "5 Series", brand: "bmw" },
    { name: "7 Series", brand: "bmw" },
    { name: "A4", brand: "audi" },

    { name: "A6", brand: "audi" },
    { name: "A8", brand: "audi" },
    // Others
    { name: "Golf", brand: "volkswagen" },
    { name: "Passat", brand: "volkswagen" },
    { name: "Fusion", brand: "ford" },
    { name: "Optra", brand: "chevrolet" },
    { name: "Mazda3", brand: "mazda" },
    { name: "Mira", brand: "daihatsu" },
  ];

  const modelRecords = [];
  for (const model of models) {
    const brand = brandRecords.find((b) => b.slug === model.brand);
    if (!brand) continue;

    const modelSlug = `${model.brand}-${model.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    // Create or find model (slug is globally unique)
    let modelRecord = await prisma.vehicleModel.findUnique({
      where: { slug: modelSlug },
    });

    if (!modelRecord) {
      // Set capacity for popular Pakistani vehicles
      let capacity: number | null = null;
      if (
        model.name === "Alto" ||
        model.name === "Mehran" ||
        model.name === "Cultus" ||
        model.name === "Vitz" ||
        model.name === "Mira" ||
        model.name === "Picanto"
      ) {
        capacity = 4;
      } else if (
        model.name === "Wagon R" ||
        model.name === "Swift" ||
        model.name === "City" ||
        model.name === "Civic" ||
        model.name === "Corolla" ||
        model.name === "Sunny" ||
        model.name === "Elantra" ||
        model.name === "Accent"
      ) {
        capacity = 5;
      } else if (
        model.name === "Bolan" ||
        model.name === "CR-V" ||
        model.name === "X-Trail" ||
        model.name === "Land Cruiser"
      ) {
        capacity = 7;
      } else {
        capacity = 5; // Default
      }

      modelRecord = await prisma.vehicleModel.create({
        data: {
          name: model.name,
          slug: modelSlug,
          vehicleBrandId: brand.id,
          capacity,
          isActive: true,
        },
      });
    }
    modelRecords.push(modelRecord);
    console.log(`  ✅ ${brand.name} ${model.name}`);
  }

  // ============================================
  // 5b. PREDEFINED VEHICLES (Quick Listing)
  // ============================================
  console.log("\n🚗 Creating predefined vehicles for quick listing...");
  const predefinedVehicles = [
    {
      name: "Wagon R",
      brand: "suzuki",
      bodyType: "HatchBack",
      color: "White",
      doors: 4,
      largeBags: 1,
      passengers: 4,
      transmission: "MANUAL",
      image: "/rental-cars-images/Suzuki-Wagon R.png",
    },
    {
      name: "Cultus",
      brand: "suzuki",
      bodyType: "HatchBack",
      color: "White",
      doors: 4,
      largeBags: 1,
      passengers: 4,
      transmission: "MANUAL",
      image: "/rental-cars-images/Suzuki-cultus.png",
    },
    {
      name: "City",
      brand: "honda",
      bodyType: "Sedan",
      color: "White",
      doors: 4,
      largeBags: 2,
      passengers: 4,
      transmission: "MANUAL",
      image: "/rental-cars-images/Honda-city.png",
    },
    {
      name: "Alto",
      brand: "suzuki",
      bodyType: "HatchBack",
      color: "White",
      doors: 4,
      largeBags: 1,
      passengers: 4,
      transmission: "MANUAL",
      image: "/rental-cars-images/suzuki-alto.png",
    },
    {
      name: "Corolla",
      brand: "toyota",
      bodyType: "Sedan",
      color: "White",
      doors: 4,
      largeBags: 2,
      passengers: 4,
      transmission: "MANUAL",
      image: "/rental-cars-images/toyota-corolla.png",
    },
    {
      name: "Yaris",
      brand: "toyota",
      bodyType: "Sedan",
      color: "White",
      doors: 4,
      largeBags: 2,
      passengers: 4,
      transmission: "AUTOMATIC",
      image: "/rental-cars-images/toyota-yaris.png",
    },
    {
      name: "BR-V",
      brand: "honda",
      bodyType: "SUV",
      color: "White",
      doors: 4,
      largeBags: 4,
      passengers: 7,
      transmission: "AUTOMATIC",
      image: "/rental-cars-images/honda-br-v.png",
    },
    {
      name: "Civic",
      brand: "honda",
      bodyType: "Sedan",
      color: "White",
      doors: 4,
      largeBags: 2,
      passengers: 4,
      transmission: "AUTOMATIC",
      image: "/rental-cars-images/honda-civic.png",
    },
    {
      name: "Hiace",
      brand: "toyota",
      bodyType: "Van",
      color: "White",
      doors: 4,
      largeBags: 4,
      passengers: 10,
      transmission: "AUTOMATIC",
      image: "/rental-cars-images/toyota-hiace.png",
    },
    {
      name: "Coaster",
      brand: "toyota",
      bodyType: "Van",
      color: "White",
      doors: 4,
      largeBags: 5,
      passengers: 29,
      transmission: "MANUAL",
      image: "/rental-cars-images/toyota-coaster.jpg",
    },
    {
      name: "Fortuner",
      brand: "toyota",
      bodyType: "SUV",
      color: "White",
      doors: 4,
      largeBags: 4,
      passengers: 7,
      transmission: "AUTOMATIC",
      image: "/rental-cars-images/toyota-furtuner.png",
    },
    {
      name: "Prado",
      brand: "toyota",
      bodyType: "SUV",
      color: "White",
      doors: 4,
      largeBags: 4,
      passengers: 7,
      transmission: "AUTOMATIC",
      image: "/rental-cars-images/toyota-prado.png",
    },
    {
      name: "Land Cruiser",
      brand: "toyota",
      bodyType: "SUV",
      color: "White",
      doors: 4,
      largeBags: 4,
      passengers: 7,
      transmission: "AUTOMATIC",
      image: "/rental-cars-images/toyota-land-cruiser.png",
    },
  ];

  const predefinedModelRecords = [];
  for (const vehicle of predefinedVehicles) {
    const brand = brandRecords.find((b) => b.slug === vehicle.brand);
    if (!brand) continue;

    const modelSlug = `${vehicle.brand}-${vehicle.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    // Find or create the model (slug is globally unique)
    let modelRecord = await prisma.vehicleModel.findUnique({
      where: { slug: modelSlug },
      include: {
        vehicleBrand: true,
      },
    });

    if (!modelRecord) {
      modelRecord = await prisma.vehicleModel.create({
        data: {
          name: vehicle.name,
          slug: modelSlug,
          vehicleBrandId: brand.id,
          capacity: vehicle.passengers,
          image: vehicle.image,
          bodyType: vehicle.bodyType,
          doors: vehicle.doors,
          largeBags: vehicle.largeBags,
          defaultColor: vehicle.color,
          defaultTransmission: vehicle.transmission as Transmission,
          isPredefined: true,
          isActive: true,
        },
        include: {
          vehicleBrand: true,
        },
      });
    } else {
      // Update existing model with predefined details
      modelRecord = await prisma.vehicleModel.update({
        where: { id: modelRecord.id },
        data: {
          capacity: vehicle.passengers,
          image: vehicle.image,
          bodyType: vehicle.bodyType,
          doors: vehicle.doors,
          largeBags: vehicle.largeBags,
          defaultColor: vehicle.color,
          defaultTransmission: vehicle.transmission as Transmission,
          isPredefined: true,
        },
        include: {
          vehicleBrand: true,
        },
      });
    }

    predefinedModelRecords.push(modelRecord);
    console.log(`  ✅ ${brand.name} ${vehicle.name} (Predefined)`);
  }

  // ============================================
  // 6. CREATE ADMIN USER (for /admin dashboard)
  // ============================================
  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@rentnow.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "Test123!@#";
  console.log("\n🔐 Creating admin user...");
  const { data: adminAuth, error: adminError } =
    await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { role: "admin" },
    });
  if (adminAuth?.user) {
    console.log(`  ✅ Admin: ${adminEmail} / ${adminPassword}`);
  } else {
    const { data: users } = await supabase.auth.admin.listUsers({
      perPage: 500,
    });
    const existing = users?.users?.find((u) => u.email === adminEmail);
    if (existing) {
      const { error: updateErr } = await supabase.auth.admin.updateUserById(
        existing.id,
        {
          password: adminPassword,
          user_metadata: { ...existing.user_metadata, role: "admin" },
        }
      );
      if (updateErr) {
        console.log(
          `  ⚠️  Admin role set for ${adminEmail}; password update failed: ${updateErr.message}`
        );
      } else {
        console.log(
          `  ✅ Admin role and password set for existing user: ${adminEmail} / ${adminPassword}`
        );
      }
    } else {
      console.log(
        `  ⚠️  Could not create admin (${
          adminError?.message || "unknown"
        }); create ${adminEmail} in Supabase and set user_metadata.role = 'admin'`
      );
    }
  }

  // ============================================
  // 7. CREATE SUPABASE AUTH USERS & VENDORS
  // ============================================
  console.log("\n👤 Creating vendors with Supabase auth accounts...");

  const vendors = [
    {
      name: "Premium Car Rentals",
      email: "premium@rentals.com",
      phone: "+92-300-1234567",
      password: "Test123!@#",
      description: "Premium vehicle rental service with luxury cars",
    },
    {
      name: "City Wheels",
      email: "city@wheels.com",
      phone: "+92-300-2345678",
      password: "Test123!@#",
      description: "Affordable car rentals for everyday needs",
    },
    {
      name: "Elite Motors",
      email: "elite@motors.com",
      phone: "+92-300-3456789",
      password: "Test123!@#",
      description: "Luxury and premium vehicle collection",
    },
    {
      name: "Budget Rent A Car",
      email: "budget@rentacar.com",
      phone: "+92-300-4567890",
      password: "Test123!@#",
      description: "Budget-friendly car rental solutions",
    },
    {
      name: "Express Car Hire",
      email: "express@carhire.com",
      phone: "+92-300-5678901",
      password: "Test123!@#",
      description: "Fast and reliable car rental service",
    },
    {
      name: "Royal Fleet",
      email: "royal@fleet.com",
      phone: "+92-300-6789012",
      password: "Test123!@#",
      description: "Royal treatment with premium vehicles",
    },
    {
      name: "Quick Drive",
      email: "quick@drive.com",
      phone: "+92-300-7890123",
      password: "Test123!@#",
      description: "Quick and easy car rental bookings",
    },
  ];

  const vendorRecords = [];
  for (const vendorData of vendors) {
    // Check if vendor already exists
    let vendor = await prisma.vendor.findUnique({
      where: { email: vendorData.email },
    });

    if (!vendor) {
      // Create Supabase auth user
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: vendorData.email,
          password: vendorData.password,
          email_confirm: true,
        });

      if (authError) {
        console.error(
          `  ⚠️  Error creating auth user for ${vendorData.email}:`,
          authError.message
        );
        continue;
      }

      // Create vendor in database
      const defaultCity = cityRecords[0];
      vendor = await prisma.vendor.create({
        data: {
          name: vendorData.name,
          slug: vendorData.name.toLowerCase().replace(/\s+/g, "-"),
          email: vendorData.email,
          phone: vendorData.phone,
          personName: `Manager ${vendorData.name}`,
          whatsappPhone: vendorData.phone,
          description: vendorData.description,
          cityId: defaultCity?.id ?? null,
          supabaseUserId: authData.user.id,
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
          isActive: true,
        },
      });
      console.log(`  ✅ Created ${vendorData.name} (${vendorData.email})`);
    } else {
      console.log(
        `  ✅ Found existing ${vendorData.name} (${vendorData.email})`
      );
    }

    vendorRecords.push(vendor);
  }

  // SEO DIMENSIONS & FAQ TEMPLATES section removed - now managed via src/lib/routes-config.ts

  // ============================================
  // 7b. ROUTE TAXONOMY (RouteType, RouteCategory, Route)
  // ============================================
  console.log(
    "\n🛣️  Creating route taxonomy (RouteType, RouteCategory, Route)..."
  );

  const routeTypes = [
    { name: "Intercity", slug: "intercity" },
    { name: "Airport Transfer", slug: "airport-transfer" },
    { name: "Tour Route", slug: "tour-route" },
    { name: "Event Route", slug: "event-route" },
    { name: "Intra-city", slug: "intra-city" },
  ];
  const routeTypeRecords: { id: number; slug: string }[] = [];
  for (const rt of routeTypes) {
    const rec = await prisma.routeType.upsert({
      where: { slug: rt.slug },
      update: {},
      create: { name: rt.name, slug: rt.slug },
    });
    routeTypeRecords.push(rec);
    console.log(`  ✅ RouteType: ${rt.name}`);
  }
  const getRouteTypeId = (slug: string) =>
    routeTypeRecords.find((r) => r.slug === slug)?.id ?? routeTypeRecords[0].id;

  const routeCategories = [
    { name: "Business", slug: "business" },
    { name: "Tourist", slug: "tourist" },
    { name: "Wedding", slug: "wedding" },
    { name: "Daily", slug: "daily" },
    { name: "Long-distance", slug: "long-distance" },
  ];
  const routeCategoryRecords: { id: number; slug: string }[] = [];
  for (const rc of routeCategories) {
    const rec = await prisma.routeCategory.upsert({
      where: { slug: rc.slug },
      update: {},
      create: { name: rc.name, slug: rc.slug },
    });
    routeCategoryRecords.push(rec);
    console.log(`  ✅ RouteCategory: ${rc.name}`);
  }
  const getRouteCategoryId = (slug: string) =>
    routeCategoryRecords.find((r) => r.slug === slug)?.id ??
    routeCategoryRecords[0].id;

  const majorRoutes = [
    // Previous routes (Rawalpindi ones specifically)
    { fromSlug: "rawalpindi", toSlug: "islamabad" },
    { fromSlug: "rawalpindi", toSlug: "lahore" },

    // User requested routes
    { fromSlug: "lahore", toSlug: "islamabad" },
    { fromSlug: "lahore", toSlug: "karachi" },
    { fromSlug: "lahore", toSlug: "multan" },
    { fromSlug: "lahore", toSlug: "faisalabad" },
    { fromSlug: "lahore", toSlug: "sialkot" },
    { fromSlug: "lahore", toSlug: "gujranwala" },
    { fromSlug: "lahore", toSlug: "murree" },
    { fromSlug: "lahore", toSlug: "bahawalpur" },
    { fromSlug: "lahore", toSlug: "bahawalnagar" },
    { fromSlug: "lahore", toSlug: "skardu" },

    { fromSlug: "karachi", toSlug: "hyderabad" },
    { fromSlug: "karachi", toSlug: "sukkur" },
    { fromSlug: "karachi", toSlug: "larkana" },
    { fromSlug: "karachi", toSlug: "gwadar" },
    { fromSlug: "karachi", toSlug: "quetta" },
    { fromSlug: "karachi", toSlug: "multan" },
    { fromSlug: "karachi", toSlug: "islamabad" },
    { fromSlug: "karachi", toSlug: "lahore" },
    { fromSlug: "karachi", toSlug: "nawabshah-benazirabad" },
    { fromSlug: "karachi", toSlug: "mirpur-khas" },

    { fromSlug: "islamabad", toSlug: "murree" },
    { fromSlug: "islamabad", toSlug: "abbottabad" },
    { fromSlug: "islamabad", toSlug: "mansehra" },
    { fromSlug: "islamabad", toSlug: "peshawar" },
    { fromSlug: "islamabad", toSlug: "skardu" },
    { fromSlug: "islamabad", toSlug: "hunza" },
    { fromSlug: "islamabad", toSlug: "gilgit" },
    { fromSlug: "islamabad", toSlug: "faisalabad" },
    { fromSlug: "islamabad", toSlug: "sialkot" },
    { fromSlug: "islamabad", toSlug: "lahore" },

    { fromSlug: "multan", toSlug: "bahawalpur" },
    { fromSlug: "multan", toSlug: "rahim-yar-khan" },
    { fromSlug: "multan", toSlug: "dera-ghazi-khan" },
    { fromSlug: "multan", toSlug: "lahore" },
    { fromSlug: "multan", toSlug: "karachi" },

    { fromSlug: "peshawar", toSlug: "islamabad" },
    { fromSlug: "peshawar", toSlug: "swat" },
    { fromSlug: "peshawar", toSlug: "mardan" },
    { fromSlug: "peshawar", toSlug: "abbottabad" },

    { fromSlug: "quetta", toSlug: "gwadar" },
    { fromSlug: "quetta", toSlug: "karachi" },
    { fromSlug: "quetta", toSlug: "turbat" },

    { fromSlug: "skardu", toSlug: "hunza" },

    { fromSlug: "gilgit", toSlug: "hunza" },
    { fromSlug: "gilgit", toSlug: "skardu" },

    { fromSlug: "faisalabad", toSlug: "lahore" },
    { fromSlug: "faisalabad", toSlug: "islamabad" },

    { fromSlug: "gujranwala", toSlug: "sialkot" },

    { fromSlug: "sialkot", toSlug: "lahore" },

    { fromSlug: "bahawalpur", toSlug: "multan" },
  ];
  const intercityTypeId = getRouteTypeId("intercity");
  const touristCategoryId = getRouteCategoryId("tourist");
  let routeCount = 0;
  for (const r of majorRoutes) {
    const originCity = cityRecords.find((c) => c.slug === r.fromSlug);
    const destCity = cityRecords.find((c) => c.slug === r.toSlug);
    if (!originCity || !destCity) continue;
    const slug = `${r.fromSlug}-to-${r.toSlug}`;
    await prisma.route.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        originCityId: originCity.id,
        destinationCityId: destCity.id,
        routeTypeId: intercityTypeId,
        routeCategoryId: touristCategoryId,
        oneWay: true,
        roundTrip: false,
      },
    });
    routeCount++;
    console.log(`  ✅ Route: ${r.fromSlug} → ${r.toSlug}`);
  }
  console.log(`  ✅ ${routeCount} routes created`);

  // ============================================
  // 9. ASSIGN PREDEFINED VEHICLES TO VENDORS
  // ============================================
  console.log("\n🚗 Cleaning up old vehicles and related bookings...");
  // Delete in order: bookings → vehicle-route links → vehicles (FK constraints)
  await prisma.booking.deleteMany({});
  await prisma.vehicleRoute.deleteMany({});
  await prisma.vehicle.deleteMany({});
  console.log(
    "  ✅ Removed all existing bookings, vehicle-route links, and vehicles"
  );

  console.log("\n🚗 Assigning predefined vehicles to vendors...");

  // Distribution: Assign 13 predefined vehicles across 7 vendors and multiple cities
  const vehicleAssignments = [
    // Premium Car Rentals (vendor 0) - Premium vehicles
    {
      vendorIndex: 0,
      modelSlug: "toyota-corolla",
      citySlug: "karachi",
      townSlug: "karachi-clifton",
      priceWithDriver: 8000,
      priceSelfDrive: 5000,
    },
    {
      vendorIndex: 0,
      modelSlug: "honda-civic",
      citySlug: "lahore",
      townSlug: "lahore-gulberg",
      priceWithDriver: 9000,
      priceSelfDrive: 5500,
    },
    {
      vendorIndex: 0,
      modelSlug: "toyota-fortuner",
      citySlug: "islamabad",
      townSlug: "islamabad-f-7",
      priceWithDriver: 15000,
      priceSelfDrive: 10000,
    },

    // City Wheels (vendor 1) - Budget vehicles
    {
      vendorIndex: 1,
      modelSlug: "suzuki-wagon-r",
      citySlug: "karachi",
      townSlug: "karachi-dha",
      priceWithDriver: 5000,
      priceSelfDrive: 3000,
    },
    {
      vendorIndex: 1,
      modelSlug: "suzuki-cultus",
      citySlug: "lahore",
      townSlug: "lahore-model-town",
      priceWithDriver: 5500,
      priceSelfDrive: 3200,
    },
    {
      vendorIndex: 1,
      modelSlug: "suzuki-alto",
      citySlug: "islamabad",
      townSlug: "islamabad-g-11",
      priceWithDriver: 4500,
      priceSelfDrive: 2800,
    },

    // Elite Motors (vendor 2) - Luxury SUVs
    {
      vendorIndex: 2,
      modelSlug: "toyota-land-cruiser",
      citySlug: "lahore",
      townSlug: "lahore-dha-phase-5",
      priceWithDriver: 20000,
      priceSelfDrive: 12000,
    },
    {
      vendorIndex: 2,
      modelSlug: "toyota-prado",
      citySlug: "islamabad",
      townSlug: "islamabad-f-8",
      priceWithDriver: 18000,
      priceSelfDrive: 11000,
    },

    // Budget Rent A Car (vendor 3) - Economy
    {
      vendorIndex: 3,
      modelSlug: "honda-city",
      citySlug: "rawalpindi",
      townSlug: "rawalpindi-chaklala",
      priceWithDriver: 7000,
      priceSelfDrive: 4500,
    },

    // Express Car Hire (vendor 4) - Mid-range
    {
      vendorIndex: 4,
      modelSlug: "toyota-yaris",
      citySlug: "karachi",
      townSlug: "karachi-pechs",
      priceWithDriver: 7500,
      priceSelfDrive: 4800,
    },
    {
      vendorIndex: 4,
      modelSlug: "honda-br-v",
      citySlug: "lahore",
      townSlug: "lahore-ferozepur-road",
      priceWithDriver: 12000,
      priceSelfDrive: 8000,
    },

    // Royal Fleet (vendor 5) - Premium & Vans
    {
      vendorIndex: 5,
      modelSlug: "toyota-hiace",
      citySlug: "islamabad",
      townSlug: "islamabad-f-7",
      priceWithDriver: 14000,
      priceSelfDrive: 9000,
    },
    {
      vendorIndex: 5,
      modelSlug: "toyota-coaster",
      citySlug: "karachi",
      townSlug: "karachi-clifton",
      priceWithDriver: 25000,
      priceSelfDrive: null,
    },
  ];

  let vehicleCount = 0;
  for (const assignment of vehicleAssignments) {
    const vendor = vendorRecords[assignment.vendorIndex];
    const model = predefinedModelRecords.find(
      (m) => m.slug === assignment.modelSlug
    );
    const city = cityRecords.find((c) => c.slug === assignment.citySlug);
    const town = townRecords.find((t) => t.slug === assignment.townSlug);

    if (!vendor || !model || !city) {
      console.log(
        `  ⚠️  Skipping vehicle assignment: ${assignment.modelSlug} (vendor, model, or city not found)`
      );
      continue;
    }

    // Generate title from model
    const title = `${model.vehicleBrand.name} ${model.name}`;
    const baseSlug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const uniqueSlug = `${baseSlug}-${vendor.slug}-${vehicleCount}`;

    await prisma.vehicle.create({
      data: {
        vendorId: vendor.id,
        vehicleModelId: model.id,
        cityId: city.id,
        townId: town?.id || null,
        title: title,
        slug: uniqueSlug,
        transmission: model.defaultTransmission as Transmission,
        seats: model.capacity || 5,
        color: model.defaultColor || "White",
        images: model.image ? [model.image] : [],
        priceWithDriver: assignment.priceWithDriver,
        priceSelfDrive: assignment.priceSelfDrive,
        isAvailable: true,
        isVerified: true,
      },
    });

    vehicleCount++;
    console.log(`  ✅ ${title} → ${vendor.name} (${city.name})`);
  }

  // Link vehicles to routes (vehicles in origin city → route) – batch with createMany
  console.log("\n🔗 Linking vehicles to routes...");
  const routesForLinking = await prisma.route.findMany({
    select: { id: true, slug: true, originCityId: true },
  });
  const vehiclesForLinking = await prisma.vehicle.findMany({
    where: { isAvailable: true },
    select: { id: true, cityId: true },
  });
  const vehicleRoutePairs: { vehicleId: string; routeId: number }[] = [];
  for (const route of routesForLinking) {
    const matchingVehicles = vehiclesForLinking.filter(
      (v) => v.cityId === route.originCityId
    );
    for (const v of matchingVehicles.slice(0, 3)) {
      vehicleRoutePairs.push({ vehicleId: v.id, routeId: route.id });
    }
  }
  const { count: vehicleRouteCount } = await prisma.vehicleRoute.createMany({
    data: vehicleRoutePairs,
    skipDuplicates: true,
  });
  console.log(`  ✅ ${vehicleRouteCount} vehicle-route links created`);

  console.log("\n🎉 Seed completed successfully!");
  console.log(`\n📊 Summary:`);
  console.log(`   - ${cityRecords.length} cities`);
  console.log(`   - ${townRecords.length} towns`);
  console.log(`   - ${brandRecords.length} vehicle brands`);
  console.log(`   - ${modelRecords.length} vehicle models`);
  console.log(`   - ${predefinedModelRecords.length} predefined vehicles`);
  console.log(`   - ${vendorRecords.length} vendors`);
  console.log(`   - ${vehicleCount} vehicle listings`);
  console.log(`\n🔐 Admin Login (see docs/auth.md):`);
  console.log(`   ${adminEmail} / ${adminPassword}`);
  console.log(`\n🔐 Vendor Login Credentials:`);
  vendors.forEach((v, i) => {
    console.log(`   ${i + 1}. ${v.email} / ${v.password}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
