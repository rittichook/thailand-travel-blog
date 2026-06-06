// Mock data สำหรับ development และ build โดยไม่ต้องการ database connection

export type MockCategory = {
  id: number
  name: string
  slug: string
  icon: string
}

export type MockProvince = {
  id: number
  name: string
  slug: string
  region: string
  coverImage: { url: string; alt: string } | null
}

export type MockPlace = {
  id: number
  title: string
  slug: string
  status: 'published' | 'draft'
  publishedAt: string
  coverImage: { url: string; alt: string }
  province: MockProvince
  category: MockCategory
  gallery: { image: { url: string; alt: string }; id: string }[]
  content: Record<string, unknown>
  highlights: { text: string }[]
  travelTips: Record<string, unknown>
}

export const mockCategories: MockCategory[] = [
  { id: 1, name: 'ธรรมชาติ', slug: 'nature', icon: '🌿' },
  { id: 2, name: 'ชายหาด', slug: 'beach', icon: '🏖️' },
  { id: 3, name: 'วัด', slug: 'temple', icon: '⛩️' },
  { id: 4, name: 'น้ำตก', slug: 'waterfall', icon: '💧' },
  { id: 5, name: 'ภูเขา', slug: 'mountain', icon: '⛰️' },
  { id: 6, name: 'วัฒนธรรม', slug: 'culture', icon: '🏛️' },
  { id: 7, name: 'อุทยาน', slug: 'national-park', icon: '🌲' },
  { id: 8, name: 'เมืองเก่า', slug: 'ancient-city', icon: '🏯' },
]

export const mockProvinces: MockProvince[] = [
  { id: 1, name: 'เชียงใหม่', slug: 'chiang-mai', region: 'north', coverImage: { url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', alt: 'เชียงใหม่' } },
  { id: 2, name: 'ภูเก็ต', slug: 'phuket', region: 'south', coverImage: { url: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80', alt: 'ภูเก็ต' } },
  { id: 3, name: 'กรุงเทพมหานคร', slug: 'bangkok', region: 'central', coverImage: { url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80', alt: 'กรุงเทพ' } },
  { id: 4, name: 'เชียงราย', slug: 'chiang-rai', region: 'north', coverImage: { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80', alt: 'เชียงราย' } },
  { id: 5, name: 'กระบี่', slug: 'krabi', region: 'south', coverImage: { url: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80', alt: 'กระบี่' } },
  { id: 6, name: 'สุโขทัย', slug: 'sukhothai', region: 'central', coverImage: null },
]

const makeLexicalContent = (text: string): Record<string, unknown> => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text, format: 0 }],
        version: 1,
      },
    ],
    version: 1,
  },
})

export const mockPlaces: MockPlace[] = [
  {
    id: 1,
    title: 'ดอยอินทนนท์',
    slug: 'doi-inthanon',
    status: 'published',
    publishedAt: '2026-01-15',
    coverImage: { url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=80', alt: 'ดอยอินทนนท์' },
    province: mockProvinces[0],
    category: mockCategories[4],
    gallery: [
      { id: '1', image: { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', alt: 'วิวภูเขา' } },
      { id: '2', image: { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', alt: 'หมอก' } },
    ],
    content: makeLexicalContent('ดอยอินทนนท์ เป็นยอดเขาสูงสุดในประเทศไทย ตั้งอยู่ในอุทยานแห่งชาติดอยอินทนนท์ จังหวัดเชียงใหม่ มีความสูง 2,565 เมตรเหนือระดับน้ำทะเล บนยอดดอยมีอากาศหนาวเย็นตลอดปี และมีทัศนียภาพที่สวยงามมาก'),
    highlights: [
      { text: 'จุดสูงสุดในประเทศไทย ความสูง 2,565 เมตร' },
      { text: 'ชมทะเลหมอกสวยงามในช่วงเช้า' },
      { text: 'น้ำตกแม่กลาง น้ำตกที่สวยที่สุดในภาคเหนือ' },
      { text: 'เส้นทางเดินป่าสำหรับนักท่องเที่ยวทุกระดับ' },
    ],
    travelTips: makeLexicalContent('เดินทางด้วยรถยนต์จากเชียงใหม่ ระยะทางประมาณ 58 กม. ใช้เวลาประมาณ 1.5 ชั่วโมง แนะนำให้ออกเดินทางแต่เช้าเพื่อชมทะเลหมอก'),
  },
  {
    id: 2,
    title: 'หาดป่าตอง',
    slug: 'patong-beach',
    status: 'published',
    publishedAt: '2026-01-20',
    coverImage: { url: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80', alt: 'หาดป่าตอง' },
    province: mockProvinces[1],
    category: mockCategories[1],
    gallery: [
      { id: '3', image: { url: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80', alt: 'ทะเล' } },
    ],
    content: makeLexicalContent('หาดป่าตองเป็นหาดทรายที่มีชื่อเสียงที่สุดในภูเก็ต มีความยาวประมาณ 3 กิโลเมตร น้ำทะเลใสสีมรกต เหมาะสำหรับการว่ายน้ำและกิจกรรมทางทะเล'),
    highlights: [
      { text: 'ชายหาดที่ได้รับความนิยมมากที่สุดในภูเก็ต' },
      { text: 'กิจกรรมทางน้ำหลากหลาย เช่น เจ็ทสกี พาราเซล' },
      { text: 'ร้านอาหารและบาร์ริมหาดมากมาย' },
    ],
    travelTips: makeLexicalContent('ช่วงเวลาที่ดีที่สุดคือเดือนพฤศจิกายน-เมษายน หลีกเลี่ยงฤดูมรสุมเดือนพฤษภาคม-ตุลาคม'),
  },
  {
    id: 3,
    title: 'วัดพระแก้ว',
    slug: 'wat-phra-kaew',
    status: 'published',
    publishedAt: '2026-02-01',
    coverImage: { url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80', alt: 'วัดพระแก้ว' },
    province: mockProvinces[2],
    category: mockCategories[2],
    gallery: [],
    content: makeLexicalContent('วัดพระศรีรัตนศาสดาราม หรือที่รู้จักกันในชื่อ วัดพระแก้ว ตั้งอยู่ในบริเวณพระบรมมหาราชวัง เป็นวัดที่สำคัญที่สุดในประเทศไทย ประดิษฐาน พระพุทธมหามณีรัตนปฏิมากร หรือ พระแก้วมรกต'),
    highlights: [
      { text: 'ประดิษฐานพระแก้วมรกต พระพุทธรูปศักดิ์สิทธิ์คู่บ้านเมือง' },
      { text: 'สถาปัตยกรรมไทยที่งดงามและละเอียดอ่อน' },
      { text: 'ตั้งอยู่ในบริเวณพระบรมมหาราชวัง' },
    ],
    travelTips: makeLexicalContent('แต่งกายสุภาพ ห้ามนำอาหารและเครื่องดื่มเข้า เปิดทำการทุกวัน 08.30-15.30 น.'),
  },
  {
    id: 4,
    title: 'วัดร่องขุ่น (วัดขาว)',
    slug: 'wat-rong-khun',
    status: 'published',
    publishedAt: '2026-02-10',
    coverImage: { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80', alt: 'วัดร่องขุ่น' },
    province: mockProvinces[3],
    category: mockCategories[2],
    gallery: [],
    content: makeLexicalContent('วัดร่องขุ่น หรือที่นิยมเรียกว่า วัดขาว เป็นวัดพุทธร่วมสมัยที่ออกแบบและก่อสร้างโดยอาจารย์เฉลิมชัย โฆษิตพิพัฒน์ มีชื่อเสียงด้านสถาปัตยกรรมสีขาวที่งดงามแปลกตา'),
    highlights: [
      { text: 'ออกแบบโดยอาจารย์เฉลิมชัย ศิลปินแห่งชาติ' },
      { text: 'สถาปัตยกรรมสีขาวเอกลักษณ์ไม่เหมือนใคร' },
      { text: 'งานศิลปะภาพจิตรกรรมฝาผนังที่น่าทึ่ง' },
    ],
    travelTips: makeLexicalContent('ห้ามนำกล้องเข้าไปในอุโบสถ เปิดทำการ 06.30-18.00 น. ทุกวัน'),
  },
  {
    id: 5,
    title: 'หมู่เกาะพีพี',
    slug: 'koh-phi-phi',
    status: 'published',
    publishedAt: '2026-02-15',
    coverImage: { url: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80', alt: 'เกาะพีพี' },
    province: mockProvinces[4],
    category: mockCategories[1],
    gallery: [],
    content: makeLexicalContent('หมู่เกาะพีพี ประกอบด้วยเกาะ 6 เกาะ ตั้งอยู่ในทะเลอันดามัน มีชื่อเสียงด้านความสวยงามของท้องทะเล หาดทรายขาว และน้ำทะเลใสสีฟ้าเขียว'),
    highlights: [
      { text: 'อ่าวมาหยา หนึ่งในหาดที่สวยที่สุดในโลก' },
      { text: 'ดำน้ำชมปะการังที่สมบูรณ์' },
      { text: 'ทัวร์เรือรอบเกาะชมทิวทัศน์สวยงาม' },
    ],
    travelTips: makeLexicalContent('เดินทางด้วยเรือเฟอร์รี่จากกระบี่หรือภูเก็ต ใช้เวลา 1.5-2 ชั่วโมง'),
  },
  {
    id: 6,
    title: 'อุทยานประวัติศาสตร์สุโขทัย',
    slug: 'sukhothai-historical-park',
    status: 'published',
    publishedAt: '2026-03-01',
    coverImage: { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'สุโขทัย' },
    province: mockProvinces[5],
    category: mockCategories[7],
    gallery: [],
    content: makeLexicalContent('อุทยานประวัติศาสตร์สุโขทัย เป็นมรดกโลกของยูเนสโก ครอบคลุมพื้นที่ราชธานีแห่งแรกของไทย มีโบราณสถานกว่า 190 แห่ง ทั้งวัด วัง และอ่างเก็บน้ำโบราณ'),
    highlights: [
      { text: 'มรดกโลกยูเนสโก อารยธรรมไทยโบราณ' },
      { text: 'วัดมหาธาตุ วัดศรีชุม และวัดสระศรี ที่งดงาม' },
      { text: 'เช่าจักรยานเที่ยวชมโบราณสถาน' },
    ],
    travelTips: makeLexicalContent('แนะนำเช่าจักรยานเพื่อเที่ยวชม เปิดทุกวัน 06.00-21.00 น. ค่าเข้าชม 100 บาท'),
  },
]
