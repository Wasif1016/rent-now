import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const lahoreTownsStr = `Aibak Block, Ahmed Block, Airline Society, Airport Road, Ali Block, Ali Park, Allama Iqbal Medical College, Allama Iqbal Town, Alpha Co Operative, Amin Park, Anar Kali, Architects Engineers Society, Army Housing Society, Asif Block, Askari Colony, Askrai Villa, Atta Turk Block, Aurangzeb Block, Awan Market, Awan Town, Baba Farid Colony, Babar Block, Badami Bagh, Badar Block, Baghban Pura, Bagrian, Bahria Town, Band Road, Barki Road, Bedian Road, Bibi Pak Daman, Bilal Gang, Bilal Park, Blue World City, Bostan Colony, Bridge Colony, Burj Colony, C.M.A. Colony, Canal Bank, Canal Breeze, Canal Garden, Canal Park Society, Canal Road, Canal View Colony, Cantt, Cavalry Ground, Chachowali, Chararrd Village, Chenab Block, Chungi Amer Sadhu, Civic Center, College Block, D.H.A., Darbar Gurreh Shah, Darbar Pir Makki, Daroghawala, Data Nagar, Davis Road, Defense, Dharampura, Doctors Society, Eden Avenue, Eden Canal Villas, Eden Homes, Eden View, Education Town, EME DHA Society, Engineer Cooperative Society, F.C. College, Falcon Complex, Faruque Ganj, Faisal Park, Faisal Town, Ferozpur Road, Firozpur Road, Fort Villas, Fortress Stadium, Fransisi Town, Garden Block, Garden Town, Garhi Shahu, Gawal Mandi, Ghazi Road, Ghous Azan Colony, Ghousia Colony, Gohawa, G.O.R., Gopal Nagar, Gor, Green Park, Green Town, Gulbahar Colony, Gulberg, Gulshan Block, Gulshan E Ravi, Hadiara, Hamdard Chowk, Harbanspura, Herbuns Pura, Huma Block, Hunza Block, Ichhra, Infantry Road, Iqbal Ave Housing Society, Iqbal Avenue, Islam Pura, Ittehad Colony, Izmir Town, J.D.A., Jail Road, Jehanzeb Block, Jinnah Hospital, Johar Town, Jubli Town, K.B. Society, Kainchi, Kamran Block, Karim Block, Karim Park, Khayaban-e-Amin, Khuda Buksh Colony, Khudad Town, Khursheed Alam Road, Kot Lakhpat, Lakshmi Chowk, Lalzar Colony, Lawrence Road, L.D.A. Avenue, L.D.A. Colony, Lidhar, LUMS, M.M. Alam Road, Madina Colony, Mahmood Booty Ring Road, Main Gulberg Boulevard, Main Khayaban Road, Main Mir Colony, Makkah Colony, Mamdoot Block, Maraghzar Colony, Mayo Hospital, Mazang, Mehran Block, Misri Shah, Model Town, Moon Market, Mughal Pura, Muhafiz Town, Munir Road, Muslim Town, Mustafa Bad, Mustafa Park, Mustafa Town, Nabi Pura, Nargis Block, Nasheman Colony, Nasheman Iqbal Housing Scheme, Nespak Society, New Garden Town, New Mustafa Colony, New PAF Colony, Nisar Colony, Nishtar Block, Nishtar Colony, Nova City, Officers Colony, OPF Colony, OPF Housing Scheme, P.A.F. Colony, P.C.S.I.R. Housing Scheme, P.C.S.I.R. Housing Society, Pak Block, Paragon City, Park View City, PASCO Housing Society, Peco Road, P.I.A. Society, Premier Energy, Punjab Govt Employs Cooperative Society, Punjab Society Near DHA, Punjab University, Qila Gujar Singh, Qila Lakshan Singh, Quaid-e-Azam Industrial Estate, R.A. Bazaar, Race Course Park, Race Course Town, Rachna Block, Railway Housing Society, Raiwind Road, Ram Garh, Rang Mehal, Ravi Block, Ravi Road, Raza Block, Rehman Garden, Revenue Society, Riwaz Garden, S.M.C.H.S., Saddar, Saint John Park, Salamatpura, Samanabad, Samia Town, Sanat Nagar, Sarwar Road, Sarshar Town, Shabir Town, Shad Bagh, Shadman Colony, Shahtaj Colony, Shaikh Zayed Hospital, Shalimar Link Road, Shalimar Town, Shama Colony, Shaukat Khanum Hospital, Shersha Block, Sikandar Block, Star Town, State Life Society, Sui Gas Society, Sukh Chain Society, Super Town, Sutlej Block, Tariq Block, Tariq Garden, Tech Society, Temple Road, Thokar Niaz Baig, Tipu Block, Tricon Valley, Tufail Road, U.C.P., Umer Block, University of Lahore, Upper Mall Scheme, Usman Block, Usman Ganj, Valencia Town, Vision City, Wafaqi Colony, Wahdat Colony, Walton Road, Wapda Colony, Wapda House, Wapda Town, West Wood Colony, Youhna Bad, Zaman Colony, Zeenat Block`;

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DB URL missing");

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const city = await prisma.city.findUnique({ where: { slug: "lahore" } });
  if (!city) {
    console.error("Lahore city not found");
    return;
  }

  const towns = lahoreTownsStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  console.log(`Seeding ${towns.length} towns for Lahore...`);

  let count = 0;
  for (const townName of towns) {
    const slug = townName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    try {
      await prisma.town.upsert({
        where: {
          slug_cityId: {
            slug,
            cityId: city.id,
          },
        },
        update: { isActive: true },
        create: {
          name: townName,
          slug,
          cityId: city.id,
          isActive: true,
        },
      });
      count++;
    } catch (e) {
      // console.error(`Failed: ${townName}`, e)
    }
  }
  console.log(`Done. Processed ${count} towns.`);
}

main().finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
