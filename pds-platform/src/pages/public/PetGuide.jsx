import { useMemo, useState } from 'react';
import {
  AlertTriangle, Bath, CalendarCheck, CheckCircle, ClipboardList,
  Clock, HeartPulse, Home, IndianRupee, LocateFixed, PawPrint, ShieldCheck,
  ShoppingBag, Sparkles, Utensils, Users,
} from 'lucide-react';

const petProfiles = [
  {
    id: 'dog',
    name: 'Dog',
    bestFor: 'Active families, security, companionship',
    space: 'Medium to large space',
    time: 4,
    monthlyCost: 4500,
    difficulty: 'Medium',
    feeding: ['2 balanced meals daily', 'Fresh water always available', 'Avoid chocolate, grapes, onion, and excessive salt'],
    grooming: ['Brush 3-4 times a week', 'Bath every 3-4 weeks', 'Trim nails monthly'],
    health: ['Core vaccines', 'Deworming schedule', 'Tick and flea prevention'],
    supplies: ['Leash and collar', 'Food bowls', 'Bed', 'Chew toys', 'Poop bags'],
    warnings: ['Needs daily walks and social time', 'Can develop anxiety if left alone too long'],
  },
  {
    id: 'cat',
    name: 'Cat',
    bestFor: 'Apartments, quiet homes, independent owners',
    space: 'Small to medium space',
    time: 2,
    monthlyCost: 3000,
    difficulty: 'Easy to medium',
    feeding: ['2-3 smaller meals daily', 'High-protein cat food', 'Fresh water or water fountain'],
    grooming: ['Brush 2-3 times a week', 'Clean litter daily', 'Trim nails every 2-3 weeks'],
    health: ['Core vaccines', 'Spay/neuter planning', 'Hairball and dental care'],
    supplies: ['Litter box', 'Scratching post', 'Carrier', 'Food bowls', 'Climbing perch'],
    warnings: ['Needs safe windows and balconies', 'Litter hygiene matters every day'],
  },
  {
    id: 'rabbit',
    name: 'Rabbit',
    bestFor: 'Gentle homes, quiet spaces, supervised handling',
    space: 'Medium indoor pen',
    time: 3,
    monthlyCost: 2500,
    difficulty: 'Medium',
    feeding: ['Unlimited hay', 'Leafy greens', 'Small pellet portion', 'Clean water'],
    grooming: ['Brush weekly', 'Clean bedding often', 'Monitor nail growth'],
    health: ['Dental checks', 'Digestive monitoring', 'Safe chewing material'],
    supplies: ['Large pen', 'Hay rack', 'Litter tray', 'Chew toys', 'Hideout box'],
    warnings: ['Very sensitive digestion', 'Must not be kept in a tiny cage all day'],
  },
  {
    id: 'bird',
    name: 'Bird',
    bestFor: 'Small homes, patient owners, daily interaction',
    space: 'Small to medium cage plus flight time',
    time: 2,
    monthlyCost: 1800,
    difficulty: 'Medium',
    feeding: ['Seed or pellet mix', 'Fresh vegetables', 'Clean water daily'],
    grooming: ['Clean cage tray daily', 'Provide bathing bowl', 'Rotate perches and toys'],
    health: ['Watch breathing and feathers', 'Avoid smoke and fumes', 'Annual avian vet check'],
    supplies: ['Spacious cage', 'Perches', 'Toys', 'Cuttle bone', 'Food cups'],
    warnings: ['Kitchen fumes can be dangerous', 'Needs social interaction and safe flight time'],
  },
  {
    id: 'fish',
    name: 'Fish',
    bestFor: 'Low-noise homes, visual calm, beginner routines',
    space: 'Tank setup',
    time: 1,
    monthlyCost: 1200,
    difficulty: 'Easy to medium',
    feeding: ['Small measured feeding', 'Avoid overfeeding', 'Species-specific food'],
    grooming: ['Partial water change weekly', 'Clean filter as instructed', 'Check water temperature'],
    health: ['Watch water quality', 'Quarantine new fish', 'Monitor spots, fins, and swimming'],
    supplies: ['Tank', 'Filter', 'Heater if needed', 'Water conditioner', 'Test kit'],
    warnings: ['Tank cycling is required before adding fish', 'Small bowls are unsafe for most fish'],
  },
  {
    id: 'turtle',
    name: 'Turtle',
    bestFor: 'Long-term owners, calm homes, careful setup',
    space: 'Large tank with basking area',
    time: 2,
    monthlyCost: 3200,
    difficulty: 'Hard',
    feeding: ['Species-specific diet', 'Calcium support', 'Clean feeding area'],
    grooming: ['Clean tank regularly', 'Maintain filter', 'Keep basking area dry'],
    health: ['UVB lighting', 'Shell checks', 'Temperature control'],
    supplies: ['Large tank', 'UVB lamp', 'Basking dock', 'Filter', 'Thermometer'],
    warnings: ['Long lifespan commitment', 'Needs strict hygiene and proper lighting'],
  },
  {
    id: 'hamster',
    name: 'Hamster',
    bestFor: 'Small homes, gentle owners, low-noise routines',
    space: 'Large ventilated enclosure',
    time: 1,
    monthlyCost: 1000,
    difficulty: 'Easy to medium',
    feeding: ['Measured hamster mix', 'Small vegetable portions', 'Fresh water bottle'],
    grooming: ['Spot-clean bedding often', 'Deep-clean enclosure weekly', 'Provide sand bath if suitable'],
    health: ['Watch teeth growth', 'Check wet tail symptoms', 'Avoid heat stress'],
    supplies: ['Large enclosure', 'Exercise wheel', 'Bedding', 'Hideouts', 'Chew blocks'],
    warnings: ['No tiny cages', 'Mostly active at night and may not like rough handling'],
  },
];

const petKnowledge = {
  dog: {
    breeds: ['Labrador Retriever', 'Indian Pariah Dog', 'Golden Retriever', 'Beagle', 'German Shepherd'],
    safeFoods: ['Cooked chicken', 'Rice', 'Pumpkin', 'Carrot', 'Dog food'],
    avoidFoods: ['Chocolate', 'Grapes', 'Onion', 'Garlic', 'Xylitol'],
    symptoms: ['Vomiting', 'Limping', 'Not eating', 'Excessive scratching', 'Breathing trouble'],
    emergency: ['Breathing trouble', 'Repeated vomiting', 'Seizure'],
  },
  cat: {
    breeds: ['Indian Billi', 'Persian', 'Siamese', 'Maine Coon', 'Bengal'],
    safeFoods: ['Cat food', 'Cooked fish', 'Cooked chicken', 'Small pumpkin portion'],
    avoidFoods: ['Onion', 'Garlic', 'Chocolate', 'Milk for lactose-sensitive cats', 'Raw dough'],
    symptoms: ['Not urinating', 'Hiding', 'Vomiting', 'Hair loss', 'Not eating'],
    emergency: ['Not urinating', 'Open-mouth breathing', 'Collapse'],
  },
  rabbit: {
    breeds: ['New Zealand White', 'Dutch Rabbit', 'Lionhead', 'Mini Rex', 'Angora'],
    safeFoods: ['Hay', 'Coriander', 'Spinach in moderation', 'Romaine lettuce', 'Rabbit pellets'],
    avoidFoods: ['Chocolate', 'Bread', 'Onion', 'Potato', 'Iceberg lettuce'],
    symptoms: ['Not eating', 'No droppings', 'Teeth grinding', 'Bloated belly', 'Head tilt'],
    emergency: ['Not eating', 'No droppings', 'Bloated belly'],
  },
  bird: {
    breeds: ['Budgie', 'Cockatiel', 'Lovebird', 'Parrot', 'Finch'],
    safeFoods: ['Pellets', 'Millet in moderation', 'Leafy greens', 'Apple without seeds', 'Carrot'],
    avoidFoods: ['Avocado', 'Chocolate', 'Caffeine', 'Alcohol', 'Salty snacks'],
    symptoms: ['Fluffed feathers', 'Tail bobbing', 'Not eating', 'Discharge', 'Sitting at cage bottom'],
    emergency: ['Tail bobbing', 'Sitting at cage bottom', 'Bleeding'],
  },
  fish: {
    breeds: ['Betta', 'Goldfish', 'Guppy', 'Molly', 'Tetra'],
    safeFoods: ['Species pellets', 'Flakes', 'Frozen bloodworms for some species', 'Blanched peas for some fish'],
    avoidFoods: ['Bread', 'Overfeeding', 'Untreated tap water', 'Random human food'],
    symptoms: ['White spots', 'Clamped fins', 'Gasping', 'Floating sideways', 'Not eating'],
    emergency: ['Gasping', 'Floating sideways', 'Rapid tank deaths'],
  },
  turtle: {
    breeds: ['Indian roofed turtle', 'Red-eared slider where legal', 'Box turtle', 'Musk turtle'],
    safeFoods: ['Species diet', 'Leafy greens', 'Calcium support', 'Aquatic turtle pellets'],
    avoidFoods: ['Processed food', 'Dairy', 'Excess fruit', 'No UVB setup'],
    symptoms: ['Soft shell', 'Swollen eyes', 'Not basking', 'Wheezing', 'No appetite'],
    emergency: ['Wheezing', 'Soft shell', 'Severe swelling'],
  },
  hamster: {
    breeds: ['Syrian Hamster', 'Dwarf Hamster', 'Roborovski', 'Chinese Hamster'],
    safeFoods: ['Hamster mix', 'Small carrot piece', 'Cucumber', 'Apple without seeds', 'Millet'],
    avoidFoods: ['Citrus', 'Onion', 'Garlic', 'Chocolate', 'Sugary snacks'],
    symptoms: ['Wet tail', 'Hair loss', 'Overgrown teeth', 'Not moving', 'Diarrhea'],
    emergency: ['Wet tail', 'Not moving', 'Severe diarrhea'],
  },
};

const lifestyleOptions = {
  homeType: ['Apartment', 'Independent house', 'Shared room'],
  dailyTime: ['1 hour', '2-3 hours', '4+ hours'],
  experience: ['First-time owner', 'Some experience', 'Experienced'],
  budget: ['Low', 'Medium', 'High'],
};

function getFitScore(pet, settings) {
  let score = 70;
  if (settings.homeType === 'Apartment' && ['cat', 'bird', 'fish'].includes(pet.id)) score += 12;
  if (settings.homeType === 'Shared room' && ['dog', 'turtle'].includes(pet.id)) score -= 16;
  if (settings.dailyTime === '1 hour' && pet.time > 2) score -= 18;
  if (settings.dailyTime === '4+ hours' && pet.time >= 3) score += 12;
  if (settings.experience === 'First-time owner' && pet.difficulty === 'Hard') score -= 20;
  if (settings.experience === 'Experienced' && pet.difficulty === 'Hard') score += 10;
  if (settings.budget === 'Low' && pet.monthlyCost > 2500) score -= 15;
  if (settings.budget === 'High' && pet.monthlyCost > 3000) score += 8;
  return Math.max(30, Math.min(98, score));
}

function formatCost(value) {
  return new Intl.NumberFormat('en-IN').format(value);
}

export default function PetGuide() {
  const [selectedPets, setSelectedPets] = useState(['dog', 'cat']);
  const [activePetId, setActivePetId] = useState('dog');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [locationStatus, setLocationStatus] = useState('');
  const [settings, setSettings] = useState({
    homeType: 'Apartment',
    dailyTime: '2-3 hours',
    experience: 'First-time owner',
    budget: 'Medium',
  });

  const selectedProfiles = useMemo(
    () => petProfiles.filter(pet => selectedPets.includes(pet.id)),
    [selectedPets]
  );

  const monthlyTotal = selectedProfiles.reduce((sum, pet) => sum + pet.monthlyCost, 0);
  const dailyTimeTotal = selectedProfiles.reduce((sum, pet) => sum + pet.time, 0);
  const topFit = selectedProfiles
    .map(pet => ({ ...pet, score: getFitScore(pet, settings) }))
    .sort((a, b) => b.score - a.score)[0];
  const activePet = petProfiles.find(pet => pet.id === activePetId) || petProfiles[0];
  const knowledge = petKnowledge[activePet.id];
  const urgentSymptoms = selectedSymptoms.filter(symptom => knowledge.emergency.includes(symptom));

  const togglePet = (id) => {
    setSelectedPets(current => (
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    ));
  };

  const updateSetting = (key, value) => {
    setSettings(current => ({ ...current, [key]: value }));
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(current => (
      current.includes(symptom)
        ? current.filter(item => item !== symptom)
        : [...current, symptom]
    ));
  };

  const handleVetSearch = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Location is not supported in this browser.');
      return;
    }

    setLocationStatus('Requesting location permission...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const url = `https://www.google.com/maps/search/veterinary+clinic/@${coords.latitude},${coords.longitude},14z`;
        window.open(url, '_blank', 'noopener,noreferrer');
        setLocationStatus('Opening nearby veterinary clinics in Maps.');
      },
      () => setLocationStatus('Location permission was denied. Search veterinary clinic near me manually.')
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <section className="bg-gradient-to-br from-emerald-800 via-green-700 to-teal-700 text-white px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-sm mb-4">
            <PawPrint size={15} />
            Pet Care Planner
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            Build a realistic care guide before bringing pets home.
          </h1>
          <p className="text-green-100 max-w-2xl mt-4">
            Select multiple pets, compare care needs, estimate monthly cost, and generate a practical routine for your home.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-green-700" />
              <h2 className="font-bold text-gray-900">Select Pets</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {petProfiles.map(pet => {
                const selected = selectedPets.includes(pet.id);
                return (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => togglePet(pet.id)}
                    className={`text-left rounded-xl border p-4 transition-all ${
                      selected
                        ? 'border-green-500 bg-green-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <PawPrint size={18} className={selected ? 'text-green-700' : 'text-gray-400'} />
                        <p className="font-bold text-gray-900">{pet.name}</p>
                      </div>
                      {selected && <CheckCircle size={17} className="text-green-700" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{pet.bestFor}</p>
                    <p className="text-xs font-semibold text-gray-700 mt-3">Approx. Rs {formatCost(pet.monthlyCost)}/month</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Home size={18} className="text-green-700" />
              <h2 className="font-bold text-gray-900">Your Lifestyle</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(lifestyleOptions).map(([key, options]) => (
                <div key={key}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {options.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateSetting(key, option)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${
                          settings[key] === option
                            ? 'bg-green-700 text-white border-green-700'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-green-700" />
              <h2 className="font-bold text-gray-900">Complete Species Guide</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {petProfiles.map(pet => (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => {
                    setActivePetId(pet.id);
                    setSelectedSymptoms([]);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${
                    activePetId === pet.id
                      ? 'bg-green-700 text-white border-green-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                  }`}
                >
                  {pet.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <GuidePanel title={`${activePet.name} Breeds`} items={knowledge.breeds} tone="blue" />
            <GuidePanel title="Recommended Foods" items={knowledge.safeFoods} tone="green" />
            <GuidePanel title="Avoid These" items={knowledge.avoidFoods} tone="red" />
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5 mt-5">
            <div className="rounded-2xl bg-gray-50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <HeartPulse size={18} className="text-red-700" />
                <h3 className="font-bold text-gray-900">Symptom Checker</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {knowledge.symptoms.map(symptom => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      selectedSymptoms.includes(symptom)
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
              <div className={`mt-4 rounded-xl p-4 border ${
                urgentSymptoms.length > 0
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-green-50 border-green-200 text-green-800'
              }`}>
                <p className="font-bold text-sm">
                  {selectedSymptoms.length === 0
                    ? 'Select symptoms to get guidance.'
                    : urgentSymptoms.length > 0
                    ? 'Vet alert: professional help recommended immediately.'
                    : 'Monitor closely and contact a vet if symptoms continue.'}
                </p>
                {urgentSymptoms.length > 0 && (
                  <p className="text-xs mt-1">Urgent symptoms selected: {urgentSymptoms.join(', ')}</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <LocateFixed size={18} className="text-blue-700" />
                <h3 className="font-bold text-blue-950">Vet Finder</h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed mb-4">
                Use your current location to search nearby veterinary clinics. This opens Maps with a local vet search.
              </p>
              <button
                type="button"
                onClick={handleVetSearch}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                <LocateFixed size={16} />
                Find Nearby Vets
              </button>
              {locationStatus && <p className="text-xs text-blue-700 mt-3">{locationStatus}</p>}
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          <SummaryCard icon={Users} label="Pets Selected" value={selectedProfiles.length || 'None'} note="Choose one or more pets" />
          <SummaryCard icon={Clock} label="Daily Time Needed" value={`${dailyTimeTotal} hr`} note="Walks, feeding, cleaning, play" />
          <SummaryCard icon={IndianRupee} label="Monthly Estimate" value={`Rs ${formatCost(monthlyTotal)}`} note="Food, hygiene, routine supplies" />
        </section>

        {selectedProfiles.length === 0 ? (
          <section className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
            <PawPrint size={42} className="mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-gray-700">Select at least one pet to generate your guide.</p>
          </section>
        ) : (
          <>
            <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Best fit from your selection</p>
                  <h2 className="text-2xl font-extrabold text-gray-900">{topFit.name}</h2>
                </div>
                <div className="rounded-xl bg-green-700 text-white px-5 py-3 text-center">
                  <p className="text-xs text-green-100 font-semibold">FIT SCORE</p>
                  <p className="text-2xl font-extrabold">{topFit.score}%</p>
                </div>
              </div>
              <div className="grid md:grid-cols-4 gap-3">
                <MiniPlan icon={Utensils} title="Food" items={topFit.feeding.slice(0, 2)} />
                <MiniPlan icon={Bath} title="Grooming" items={topFit.grooming.slice(0, 2)} />
                <MiniPlan icon={HeartPulse} title="Health" items={topFit.health.slice(0, 2)} />
                <MiniPlan icon={ShoppingBag} title="Supplies" items={topFit.supplies.slice(0, 2)} />
              </div>
            </section>

            <section className="grid lg:grid-cols-2 gap-5">
              {selectedProfiles.map(pet => (
                <PetCareCard key={pet.id} pet={pet} score={getFitScore(pet, settings)} />
              ))}
            </section>

            <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarCheck size={18} className="text-green-700" />
                  <h2 className="font-bold text-gray-900">Daily Routine</h2>
                </div>
                <div className="space-y-3">
                  <RoutineRow time="Morning" task="Fresh water, first meal, quick health check, clean bowls or litter area." />
                  <RoutineRow time="Afternoon" task="Play, walk, enrichment, tank/cage temperature check if needed." />
                  <RoutineRow time="Evening" task="Second meal, grooming touch-up, bedding check, calm bonding time." />
                  <RoutineRow time="Weekly" task="Deep cleaning, supply refill, weight/behavior notes, photo record." />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-amber-700" />
                  <h2 className="font-bold text-amber-950">Before You Adopt</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'Confirm landlord and family permission.',
                    'Keep emergency vet contact ready.',
                    'Budget for vaccines and unexpected illness.',
                    'Do not buy exotic pets without legal clarity.',
                    'Avoid impulse adoption during exams or travel.',
                    'Plan who cares for the pet when you are away.',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2 rounded-xl bg-white/70 p-3 text-sm text-amber-900">
                      <ShieldCheck size={15} className="text-amber-700 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, note }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="w-11 h-11 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-3">
        <Icon size={20} />
      </div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{note}</p>
    </div>
  );
}

function MiniPlan({ icon: Icon, title, items }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
        <Icon size={16} className="text-green-700" />
        {title}
      </div>
      <ul className="space-y-1">
        {items.map(item => (
          <li key={item} className="text-xs text-gray-600 leading-relaxed">{item}</li>
        ))}
      </ul>
    </div>
  );
}

function GuidePanel({ title, items, tone }) {
  const styles = {
    blue: 'bg-blue-50 text-blue-800 border-blue-100',
    green: 'bg-green-50 text-green-800 border-green-100',
    red: 'bg-red-50 text-red-800 border-red-100',
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[tone]}`}>
      <h3 className="font-bold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <CheckCircle size={14} className="shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PetCareCard({ pet, score }) {
  const sections = [
    { title: 'Feeding', icon: Utensils, items: pet.feeding },
    { title: 'Grooming', icon: Bath, items: pet.grooming },
    { title: 'Health', icon: HeartPulse, items: pet.health },
    { title: 'Supplies', icon: ShoppingBag, items: pet.supplies },
  ];

  return (
    <article className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900">{pet.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{pet.bestFor}</p>
        </div>
        <div className="rounded-xl bg-blue-50 px-3 py-2 text-center">
          <p className="text-xs text-blue-600 font-semibold">Fit</p>
          <p className="font-extrabold text-blue-800">{score}%</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <InfoTile label="Space" value={pet.space} />
        <InfoTile label="Time" value={`${pet.time} hr/day`} />
        <InfoTile label="Cost" value={`Rs ${formatCost(pet.monthlyCost)}`} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {sections.map(({ title, icon: Icon, items }) => (
          <div key={title} className="rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
              <Icon size={15} className="text-green-700" />
              {title}
            </div>
            <ul className="space-y-1">
              {items.map(item => (
                <li key={item} className="text-xs text-gray-600 leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-4">
        <div className="flex items-center gap-2 font-bold text-red-800 mb-2">
          <ClipboardList size={15} />
          Watch-outs
        </div>
        <ul className="space-y-1">
          {pet.warnings.map(item => (
            <li key={item} className="text-xs text-red-700 leading-relaxed">{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl bg-green-50 p-3">
      <p className="text-xs text-green-700 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-green-950 mt-1">{value}</p>
    </div>
  );
}

function RoutineRow({ time, task }) {
  return (
    <div className="flex gap-3 rounded-xl bg-gray-50 p-3">
      <div className="w-24 shrink-0 text-xs font-bold text-green-700 uppercase tracking-wide">{time}</div>
      <p className="text-sm text-gray-600 leading-relaxed">{task}</p>
    </div>
  );
}
