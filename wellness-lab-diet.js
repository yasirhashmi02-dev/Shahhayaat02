/* Wellness Lab: Diet & Nutrition Plan
   6-step quiz -> BMI, calories, macros, water, foods to eat / avoid, 3-day Indian meal plan.
   General wellness guidance only; not medical advice. Loads after wellness-lab-boost.js. */
(function () {
  'use strict';
  if (typeof LAB === 'undefined') return;
  if (Array.isArray(LAB._secs) && LAB._secs.indexOf('sDiet') < 0) LAB._secs.push('sDiet');

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
  var num = function (v) { var n = parseFloat(v); return isFinite(n) ? n : null; };
  var r50 = function (x) { return Math.round(x / 50) * 50; };
  var KEY = 'wl_diet_answers';
  var STEPS = 6;
  var STEP_NAMES = ['About you', 'Body & activity', 'Your goal', 'Food choices', 'Health', 'Eating habits'];

  /* ───────────────────────── Option data ───────────────────────── */
  var ACT = [
    { id: 'sed',   f: 1.2,   e: '🪑', t: 'Mostly sitting',    d: 'Desk job, little exercise' },
    { id: 'light', f: 1.375, e: '🚶', t: 'Lightly active',    d: 'Walks or light exercise 1–3 days a week' },
    { id: 'mod',   f: 1.55,  e: '🏃', t: 'Moderately active', d: 'Exercise 3–5 days a week' },
    { id: 'high',  f: 1.725, e: '🏋', t: 'Very active',       d: 'Hard exercise 6–7 days a week or a physical job' }
  ];
  var GOALS = [
    { id: 'lose',     e: '📉', t: 'Lose weight',            d: 'Reduce body fat gradually' },
    { id: 'maintain', e: '⚖',  t: 'Stay at my weight',      d: 'Keep eating well' },
    { id: 'gain',     e: '📈', t: 'Gain weight or muscle',  d: 'Build strength and size' },
    { id: 'health',   e: '💚', t: 'Just eat healthier',     d: 'More energy, better habits' }
  ];
  var DIETS = [
    { id: 'veg', e: '🥦', t: 'Vegetarian' }, { id: 'egg', e: '🥚', t: 'Eggetarian' },
    { id: 'nonveg', e: '🍗', t: 'Non-vegetarian' }, { id: 'vegan', e: '🌱', t: 'Vegan' }, { id: 'jain', e: '🙏', t: 'Jain' }
  ];
  var ALLERGIES = [
    { id: 'dairy', t: 'Dairy / lactose' }, { id: 'gluten', t: 'Gluten / wheat' }, { id: 'nuts', t: 'Nuts / peanuts' },
    { id: 'soy', t: 'Soy' }, { id: 'egg', t: 'Egg' }, { id: 'fish', t: 'Fish / shellfish' }
  ];
  var CONDS = [
    { id: 'diab', t: 'Diabetes / high sugar' }, { id: 'bp', t: 'High blood pressure' }, { id: 'chol', t: 'High cholesterol' },
    { id: 'thy', t: 'Thyroid' }, { id: 'pcos', t: 'PCOD / PCOS', f: 1 }, { id: 'acid', t: 'Acidity / GERD' },
    { id: 'anem', t: 'Anaemia / low iron' }, { id: 'liver', t: 'Fatty liver' }, { id: 'kid', t: 'Kidney disease' },
    { id: 'preg', t: 'Pregnant / breastfeeding', f: 1 }, { id: 'ed', t: 'Past or present eating disorder' }
  ];
  var SLEEP = [['lt5', 'Under 5 h'], ['5to6', '5 to 6 h'], ['6to7', '6 to 7 h'], ['7to9', '7 to 9 h'], ['gt9', 'Over 9 h']];
  var HAB = [
    { id: 'bf',    q: 'How often do you eat breakfast?', o: [['Every day', 2], ['Sometimes', 1], ['Rarely or never', 0]],
      tip: 'Try a protein-rich breakfast (besan chilla, eggs, dal-based dishes, curd). It steadies energy and cravings later in the day.' },
    { id: 'fv',    q: 'Servings of vegetables and fruit per day?', o: [['5 or more', 2], ['2 to 4', 1], ['0 to 1', 0]],
      tip: 'Aim for half your plate as vegetables at lunch and dinner, and one or two fruits a day.' },
    { id: 'sug',   q: 'Sweet drinks per day (sweet chai or coffee, cold drinks, packaged juice)?', o: [['None or 1', 2], ['2 to 3', 1], ['4 or more', 0]],
      tip: 'Cut sweet drinks gradually: half the sugar first, then none. They add calories without filling you up.' },
    { id: 'fry',   q: 'Fried or packaged snacks (samosa, chips, namkeen, biscuits)?', o: [['Rarely', 2], ['2 to 4 times a week', 1], ['Almost daily', 0]],
      tip: 'Swap one fried snack a day for roasted chana, makhana, fruit or sprouts.' },
    { id: 'out',   q: 'How often do you eat out or order in?', o: [['Rarely', 2], ['1 to 3 times a week', 1], ['4 or more times a week', 0]],
      tip: 'Cook at home more often and choose grilled, steamed or dal-and-roti style meals when eating out.' },
    { id: 'late',  q: 'When do you usually have dinner?', o: [['Before 8:30 pm', 2], ['8:30 to 10 pm', 1], ['After 10 pm', 0]],
      tip: 'Move dinner earlier and keep a 2 to 3 hour gap before sleep. It helps digestion and sleep.' },
    { id: 'water', q: 'Glasses of water per day?', o: [['8 or more', 2], ['4 to 7', 1], ['Under 4', 0]],
      tip: 'Keep a bottle with you and sip through the day. A glass on waking and one before each meal is an easy start.' },
    { id: 'salt',  q: 'Extra salt, pickle or papad?', o: [['Rarely', 2], ['Sometimes', 1], ['Daily', 0]],
      tip: 'Taste food before adding salt and keep pickles and papad for occasional use.' },
    { id: 'alc',   q: 'Alcohol or tobacco?', o: [['None', 2], ['Occasionally', 1], ['Regularly', 0]],
      tip: 'Alcohol adds empty calories and strains the liver. Cutting back helps almost every health goal.' }
  ];

  /* ───────────────────────── Calculations ───────────────────────── */
  function has(a, id) { return a.conds.indexOf(id) >= 0; }
  function allergic(a, id) { return a.allergies.indexOf(id) >= 0; }

  function heightCm(a) {
    if (a.hUnit === 'ft') { return (num(a.ft) || 0) * 30.48 + (num(a.inch) || 0) * 2.54; }
    return num(a.h);
  }

  function calc(a) {
    var h = heightCm(a), w = num(a.w), age = num(a.age), male = a.sex === 'm';
    var hM = h / 100, bmi = w / (hM * hM);
    var r = { h: Math.round(h), w: w, age: age, male: male, bmi: Math.round(bmi * 10) / 10, notes: [], restrict: null };
    r.cat = bmi < 18.5 ? ['Underweight', '#2563EB'] : bmi < 23 ? ['Healthy weight', '#16A34A'] : bmi < 25 ? ['Overweight', '#F59E0B']
          : bmi < 30 ? ['Obese (Class I)', '#EA580C'] : ['Obese (Class II)', '#DC2626'];
    r.wMin = Math.round(18.5 * hM * hM * 10) / 10;
    r.wMax = Math.round(22.9 * hM * hM * 10) / 10;

    /* waist, hip */
    var waist = num(a.waist), hip = num(a.hip);
    if (waist) {
      r.waist = waist; r.whtr = Math.round(waist / h * 100) / 100;
      r.waistHigh = male ? waist >= 90 : waist >= 80;
    }
    if (waist && hip) { r.whr = Math.round(waist / hip * 100) / 100; r.whrHigh = male ? r.whr > 0.90 : r.whr > 0.85; }

    /* safety: plans we do not number */
    if (has(a, 'ed')) { r.restrict = 'ed'; return r; }
    if (age < 18) { r.restrict = 'teen'; return r; }
    if (has(a, 'kid')) { r.restrict = 'kid'; return r; }

    var bmr = 10 * w + 6.25 * h - 5 * age + (male ? 5 : -161);
    var actObj = ACT.filter(function (x) { return x.id === a.act; })[0] || ACT[0];
    var tdee = bmr * actObj.f;
    r.bmr = Math.round(bmr); r.tdee = Math.round(tdee);

    var goal = a.goal === 'health' ? 'maintain' : a.goal, pace = a.pace === 'steady' ? 'steady' : 'gentle';
    if (has(a, 'preg')) {
      goal = 'maintain';
      r.notes.push('Because you are pregnant or breastfeeding, this plan is for maintenance only. Your body needs extra energy and nutrients, so please follow your doctor\'s advice on calories and supplements.');
    } else if (bmi < 18.5 && goal !== 'gain') {
      goal = 'gain';
      r.notes.push('Your BMI is below the healthy range, so we have aimed this plan at gentle weight gain.');
    } else if (goal === 'lose' && bmi < 23) {
      pace = 'gentle';
      r.notes.push('Your BMI is already in the healthy range, so we use a small calorie reduction. Strength training and enough protein will help more than chasing a lower number on the scale.');
    } else if (goal === 'gain' && bmi >= 25) {
      goal = 'maintain';
      r.notes.push('Your BMI is above the healthy range, so we set maintenance calories. Strength training with enough protein builds muscle without adding fat.');
    }
    r.goal = goal;

    var kcal;
    if (goal === 'lose') {
      kcal = tdee * (pace === 'gentle' ? 0.88 : 0.80);
      var floor = male ? 1500 : 1200;
      kcal = Math.max(kcal, Math.min(floor, tdee));
      r.pace = pace;
    } else if (goal === 'gain') {
      kcal = tdee * (bmi < 18.5 ? 1.15 : 1.10);
    } else { kcal = tdee; }
    kcal = r50(kcal);
    r.kcal = kcal;

    /* time to reach healthy range */
    var dayDiff = kcal - tdee, perWeek = Math.abs(dayDiff) * 7 / 7700;
    if (goal === 'lose' && bmi >= 23 && perWeek > 0.05) {
      r.deltaKg = Math.round((w - r.wMax) * 10) / 10; r.weeks = Math.ceil(r.deltaKg / perWeek);
    } else if (goal === 'gain' && bmi < 18.5 && perWeek > 0.05) {
      r.deltaKg = Math.round((r.wMin - w) * 10) / 10; r.weeks = Math.ceil(r.deltaKg / perWeek);
    }
    r.perWeek = Math.round(perWeek * 100) / 100;

    /* macros */
    var ref = bmi > 25 ? 25 * hM * hM : w;
    var gkg = goal === 'lose' ? 1.2 : goal === 'gain' ? 1.5 : 1.0;
    if (a.act === 'high') gkg += 0.2;
    var pg = Math.round(gkg * ref);
    pg = Math.min(pg, Math.round(kcal * 0.30 / 4));
    pg = Math.max(pg, Math.round(0.8 * ref));
    var fatPct = (has(a, 'diab') || has(a, 'pcos')) ? 0.32 : (has(a, 'chol') || has(a, 'liver')) ? 0.25 : 0.28;
    var fg = Math.round(kcal * fatPct / 9);
    var cg = Math.max(0, Math.round((kcal - pg * 4 - fg * 9) / 4));
    r.macros = {
      p: pg, f: fg, c: cg,
      pPct: Math.round(pg * 4 / kcal * 100), fPct: Math.round(fg * 9 / kcal * 100)
    };
    r.macros.cPct = 100 - r.macros.pPct - r.macros.fPct;
    r.fibre = Math.max(25, Math.round(kcal / 1000 * 14));
    r.water = Math.min(4.5, Math.max(2, Math.round((w * 0.035 + (a.act === 'high' ? 0.5 : 0)) * 2) / 2));
    r.split = [0.25, 0.10, 0.30, 0.10, 0.25].map(function (p) { return Math.round(kcal * p / 10) * 10; });
    return r;
  }

  /* diet quality score from the habits quiz */
  function quality(a) {
    var total = 0, low = [];
    HAB.forEach(function (q) {
      var i = a.hab && a.hab[q.id];
      var pts = (i === undefined || i === null) ? 1 : q.o[i][1];
      total += pts; if (pts < 2) low.push({ q: q, pts: pts });
    });
    low.sort(function (x, y) { return x.pts - y.pts; });
    var score = Math.round(total / (HAB.length * 2) * 100);
    var sl = a.sleep, sleepTip = (sl === 'lt5' || sl === '5to6')
      ? 'Short sleep raises hunger and cravings. Aim for 7 to 8 hours, and keep a regular sleep time.' : null;
    return { score: score, low: low, sleepTip: sleepTip };
  }

  /* ───────────────────────── Foods & guidance ───────────────────────── */
  function filt(a, items) {
    return items.filter(function (it) {
      var tag = it[1];
      if (!tag) return true;
      if (tag === 'root') return a.diet !== 'jain';
      return !allergic(a, tag);
    }).map(function (it) { return it[0]; });
  }
  function eatGroups(a, r) {
    var protein = {
      veg:    [['Dals: moong, masoor, toor'], ['Rajma, chole, black chana'], ['Sprouts'], ['Paneer', 'dairy'], ['Curd or buttermilk', 'dairy'], ['Soya chunks', 'soy'], ['Besan (gram flour) chilla']],
      egg:    [['Eggs (whole or whites)', 'egg'], ['Dals: moong, masoor, toor'], ['Rajma, chole, black chana'], ['Paneer', 'dairy'], ['Curd or buttermilk', 'dairy'], ['Sprouts']],
      nonveg: [['Chicken breast (grilled or curried)'], ['Fish: rohu, surmai, salmon', 'fish'], ['Eggs', 'egg'], ['Dals and legumes'], ['Curd or buttermilk', 'dairy']],
      vegan:  [['Tofu or tempeh', 'soy'], ['Soya chunks', 'soy'], ['Lentils and dals'], ['Chickpeas, rajma'], ['Peanuts and seeds', 'nuts']],
      jain:   [['Moong, masoor, toor dal'], ['Paneer', 'dairy'], ['Curd or buttermilk', 'dairy'], ['Besan chilla'], ['Tofu or soya chunks', 'soy']]
    }[a.diet] || [];
    var groups = [
      { e: '🌾', t: 'Smart carbs', items: filt(a, [['Whole-wheat or multigrain roti', 'gluten'], ['Brown or red rice (small portion)'], ['Millets: ragi, jowar, bajra'], ['Oats or daliya', 'gluten'], ['Poha or vegetable millet upma']].concat(has(a, 'diab') ? [] : [['Sweet potato', 'root']])) },
      { e: '🫘', t: 'Protein', items: filt(a, protein) },
      { e: '🥬', t: 'Vegetables', items: filt(a, [['Green leafy: palak, methi, sarson'], ['Lauki, tori, tinda, bhindi'], ['Cucumber, tomato, salad vegetables'], ['Broccoli, cabbage, cauliflower'], ['Carrot, beetroot', 'root']]) },
      { e: '🍎', t: 'Fruits', items: has(a, 'diab') ? ['Guava, papaya, apple (whole fruit, small portions)', 'Orange or mosambi (whole, not juice)', 'Berries or jamun (seasonal)'] : ['Guava, papaya, apple', 'Orange, mosambi, pomegranate', 'Berries or jamun (seasonal)', 'Banana (one a day)'] },
      { e: '🥜', t: 'Healthy fats', items: filt(a, [['Almonds, walnuts (a small handful)', 'nuts'], ['Flax, chia or pumpkin seeds'], ['Mustard or groundnut oil: about 4 to 5 tsp a day in total'], [(has(a, 'chol') || has(a, 'liver')) ? 'Ghee: 1 tsp or less a day' : 'Ghee: 1 to 2 tsp a day', 'dairy']]) },
      { e: '💧', t: 'Drinks', items: filt(a, [['Water: aim for ' + (r.water || 2.5) + ' litres a day'], ['Buttermilk (chaas)', 'dairy'], ['Lemon water, no sugar'], ['Coconut water'], ['Green or herbal tea'], ['Jeera or ajwain water']]) }
    ];
    var goalItems = {
      lose: ['Soups, salads and sprouts to fill you up with fewer calories', 'Protein at every meal to stay full', 'High-fibre foods: dals, vegetables, whole grains'],
      gain: ['A banana or date shake with milk or plant milk', 'An extra protein snack: roasted chana, sprouts, eggs or paneer (as per your diet)', 'Healthy fats: nuts, seeds, a little ghee', 'Eat every 3 to 4 hours and do not skip meals'],
      maintain: ['A balanced plate: half vegetables, a quarter protein, a quarter whole grains', 'Regular meal times', 'Fresh, home-cooked food most days']
    }[r.goal] || [];
    groups.unshift({ e: '⭐', t: 'For your goal', items: goalItems });
    return groups;
  }

  function condNotes(a) {
    var N = {
      diab: ['Diabetes or high blood sugar', ['Choose low-glycaemic carbs: millets, oats, brown rice, dals and whole grains. Keep rice and roti portions moderate.', 'Spread meals through the day and pair carbs with protein and vegetables.', 'Whole fruit in small portions is better than juice.', 'Meal timing and medicines (especially insulin or sugar-lowering tablets) should be set with your doctor.']],
      bp: ['High blood pressure', ['Keep salt under about 5 g (one level teaspoon) a day, counting pickles, papad, chips and packaged foods.', 'Potassium-rich foods help: banana, coconut water, leafy greens, beans (unless your doctor has restricted potassium).', 'Prefer fresh food over processed food.', 'Take your medicines exactly as prescribed.']],
      chol: ['High cholesterol', ['Choose oats, barley, dals, vegetables and fruit for soluble fibre.', 'Use less ghee, butter, cream and coconut oil, and avoid fried and bakery foods.', 'Add flaxseed, walnuts or fish (if you eat it) for healthy fats.']],
      thy: ['Thyroid', ['Use iodised salt in normal amounts.', 'Take thyroid medicine exactly as prescribed (usually on an empty stomach) and keep it apart from calcium or iron supplements as your doctor advises.', 'Cooked cabbage, cauliflower and broccoli are fine in normal amounts.', 'Very large amounts of soy can interfere with some thyroid medicines, so ask your doctor.']],
      pcos: ['PCOD / PCOS', ['Choose low-glycaemic, high-fibre carbs and pair them with protein.', 'Cut sugary drinks, sweets and refined flour.', 'Regular meals and regular exercise help your body use insulin better.', 'Add omega-3 foods: flaxseed, walnuts, and fish if you eat it.']],
      acid: ['Acidity or GERD', ['Eat smaller, more frequent meals and finish dinner 2 to 3 hours before lying down.', 'Limit very spicy and oily food, strong tea or coffee and fizzy drinks.', 'Banana, oats, cooked vegetables, coconut water and plain buttermilk are usually well tolerated.', 'Fennel seeds (saunf) after meals are a traditional favourite.']],
      anem: ['Anaemia or low iron', ['Include iron-rich foods: leafy greens, dates, lentils, rajma, pomegranate, a little jaggery, and chicken, fish or eggs if you eat them.', 'Pair iron foods with vitamin C (lemon, amla, orange) to improve absorption.', 'Avoid tea or coffee within an hour of meals.', 'Ask your doctor for a blood test before taking iron supplements.']],
      liver: ['Fatty liver', ['Cut sugary drinks, sweets, refined flour and deep-fried food. These matter most.', 'Avoid alcohol completely.', 'Fill half your plate with vegetables and choose whole grains, dals and lean protein.', 'Gradual weight loss works better than crash diets. Ask your doctor about follow-up tests.']],
      preg: ['Pregnant or breastfeeding', ['Your body needs extra energy, protein, iron, calcium and folate. Follow your doctor\'s or dietitian\'s advice and any prescribed supplements.', 'Avoid alcohol, raw or undercooked meat, eggs and fish, and unpasteurised dairy.', 'Limit tea and coffee to about 2 cups a day.', 'This plan does not aim for weight loss.']]
    };
    return a.conds.filter(function (c) { return N[c]; }).map(function (c) { return N[c]; });
  }

  function avoidList(a, r, q) {
    var L = [
      ['Sugary drinks and packaged juices', 'Colas, sweet lassi, packaged juice and sweet chai add a lot of sugar without filling you up.'],
      ['Deep-fried snacks', 'Samosa, pakora, kachori, chips and namkeen are high in unhealthy fat and calories.'],
      ['Refined flour (maida) foods', 'White bread, bakery items, noodles and biscuits spike blood sugar and leave you hungry again soon.'],
      ['Packaged and ultra-processed foods', 'Instant noodles, ready-to-eat snacks and sauces often hide salt, sugar and unhealthy fats.'],
      ['Too much salt', 'Extra salt, pickles and papad can push up blood pressure over time.']
    ];
    if (r.goal === 'lose') L.push(['Skipping meals, then overeating', 'Long gaps cause cravings and bigger evening portions.'], ['Large late-night portions of rice or sweets', 'Heavy late carbs are easy to overeat and slow to burn off.']);
    if (r.goal === 'gain') L.push(['Filling up on tea, coffee or water before meals', 'It can take away your appetite for real food.'], ['Skipping meals', 'Spread your calories over 5 meals and snacks.']);
    if (has(a, 'diab')) L.unshift(['Sweets, juice and big portions of white rice', 'Mango, grapes and chikoo are fine in small portions only. These raise blood sugar quickly.']);
    if (has(a, 'bp')) L.unshift(['Pickles, papad, chips, instant soups and noodles', 'They carry a lot of hidden salt.']);
    if (has(a, 'chol')) L.unshift(['Butter, cream, bakery items and fried food', 'These raise the fats in your blood that harm your heart.']);
    if (has(a, 'acid')) L.unshift(['Spicy, oily food, strong tea or coffee, fizzy drinks, late dinners', 'These are common triggers for acidity and reflux.']);
    if (has(a, 'liver')) L.unshift(['Alcohol, sugary drinks and fried food', 'These add fat to the liver.']);
    if (has(a, 'pcos')) L.unshift(['Sweets, sugary drinks and refined flour', 'They make insulin resistance worse.']);
    if (has(a, 'anem')) L.unshift(['Tea or coffee with meals', 'They reduce how much iron your body absorbs.']);
    if (has(a, 'preg')) L.unshift(['Alcohol, raw or undercooked meat, eggs and fish, unpasteurised dairy', 'These carry risks in pregnancy and breastfeeding.']);
    if (a.allergies.length) {
      var names = a.allergies.map(function (id) { return ALLERGIES.filter(function (x) { return x.id === id; })[0].t; }).join(', ');
      L.unshift(['Your allergens: ' + names, 'We have swapped these out of the meal plan. Always read labels, and ask your doctor about hidden sources.']);
    }
    q.low.slice(0, 3).forEach(function (x) {
      if (x.q.id === 'sug') L.push(['Your daily sweet drinks', 'You told us you have several. Cut them down step by step.']);
      if (x.q.id === 'fry') L.push(['Your fried and packaged snacks', 'You told us you have them often. Swap one a day for fruit, makhana or roasted chana.']);
    });
    return L;
  }

  var AYU = [
    'Eat freshly cooked, warm meals, with your largest meal at midday when digestion is strongest.',
    'Sit down to eat, without screens, and chew well.',
    'Stop when you are about three-quarters full.',
    'Sip warm water through the day instead of ice-cold drinks.',
    'Finish dinner at least 2 to 3 hours before sleep.',
    'Cook with everyday spices such as turmeric, cumin, coriander and ginger.'
  ];

  /* ───────────────────────── 3-day meal plans ───────────────────────── */
  var PLANS = {
    veg: [
      ['Vegetable poha with peanuts + 1 glass milk', '1 apple + 5 almonds', '{R} rotis + 1 bowl dal + mixed vegetable sabzi + cucumber-tomato salad + 1 small bowl curd', 'Roasted chana (1 small bowl) + green tea', '{R2} rotis + paneer bhurji (100 g) + 1 bowl vegetable soup'],
      ['2 besan chillas with mint chutney + 1 glass buttermilk', '1 banana or seasonal fruit', '{C} cup cooked rice + 1 bowl rajma or chole + sautéed greens + salad', 'Sprouts chaat with lemon', '1 large bowl vegetable khichdi + 1 small bowl curd + salad'],
      ['3 idlis with sambar + 1 glass buttermilk', '1 fruit + 1 tbsp mixed seeds', '{R} rotis + palak paneer (1 bowl) + dal + salad', 'Roasted makhana (1 cup) + herbal tea', 'Grilled paneer and vegetable bowl + {R2} roti']
    ],
    egg: [
      ['2-egg vegetable omelette + 1 multigrain toast + 1 fruit', '1 apple + 5 almonds', '{R} rotis + 1 bowl dal + mixed vegetable sabzi + cucumber-tomato salad + 1 small bowl curd', 'Roasted chana (1 small bowl) + green tea', 'Egg bhurji (2 eggs) + {R2} rotis + salad'],
      ['2 besan chillas with mint chutney + 1 glass buttermilk', '1 banana or seasonal fruit', '{C} cup cooked rice + egg curry (2 eggs) + sautéed greens + salad', 'Sprouts chaat with lemon', '1 large bowl vegetable khichdi + 1 small bowl curd + salad'],
      ['Vegetable upma + 1 boiled egg', '1 fruit + 1 tbsp mixed seeds', '{R} rotis + dal + mixed sabzi + salad + 1 small bowl curd', 'Roasted makhana (1 cup) + herbal tea', 'Vegetable and egg stir-fry bowl + {R2} rotis']
    ],
    nonveg: [
      ['2-egg omelette + 1 multigrain toast + 1 fruit', '1 apple + 5 almonds', '{R} rotis + grilled or curried chicken (100 to 120 g) + sabzi + salad', 'Roasted chana (1 small bowl) + green tea', 'Fish curry (rohu or surmai, 100 to 120 g) + {R2} rotis + salad'],
      ['Vegetable poha + 1 boiled egg', '1 banana', '{C} cup cooked rice + dal + stir-fried vegetables + 1 small bowl curd', 'Sprouts chaat with lemon', 'Grilled chicken tikka (100 g) + salad + {R2} roti'],
      ['2 besan chillas + 1 glass buttermilk', '1 fruit + a handful of walnuts', '{R} rotis + egg curry (2 eggs) + salad', 'Roasted makhana (1 cup) + herbal tea', 'Grilled fish or paneer + vegetable bowl + {R2} roti']
    ],
    vegan: [
      ['Vegetable poha with peanuts + 1 glass soy or almond milk', '1 apple + 5 almonds', '{R} rotis + 1 bowl dal + mixed vegetable sabzi + salad', 'Roasted chana (1 small bowl) + green tea', '{R2} rotis + tofu bhurji (100 g) + 1 bowl vegetable soup'],
      ['2 besan chillas with mint chutney', '1 banana or seasonal fruit', '{C} cup cooked rice + 1 bowl rajma or chole + sautéed greens + salad', 'Sprouts chaat with lemon', '1 large bowl vegetable khichdi + salad'],
      ['3 idlis with sambar and coconut chutney', '1 fruit + 1 tbsp mixed seeds', '{R} rotis + dal + tofu or soya-chunk curry + salad', 'Roasted makhana (1 cup) + herbal tea', 'Stir-fried tofu and vegetable bowl + {R2} roti']
    ],
    jain: [
      ['2 moong dal chillas with mint chutney + 1 glass milk', '1 apple + 5 almonds', '{R} rotis + moong dal + lauki or tinda sabzi + cucumber salad + 1 small bowl curd', 'Roasted makhana (1 cup) + herbal tea', '{R2} rotis + paneer and capsicum sabzi + 1 bowl vegetable soup (no root vegetables)'],
      ['Vegetable poha (no onion or potato) with peanuts + 1 glass buttermilk', '1 banana or seasonal fruit', '{C} cup cooked rice + toor dal + bhindi sabzi + salad', 'Fruit bowl', '1 large bowl moong dal khichdi + 1 small bowl curd + salad'],
      ['3 idlis with sambar (no onion or garlic)', '1 fruit + 1 tbsp mixed seeds', '{R} rotis + paneer curry (Jain style) + dal + salad', 'Roasted chana (1 small bowl) + herbal tea', 'Grilled paneer with tori and beans + {R2} roti']
    ]
  };
  var SLOTS = [['🌅', 'Breakfast'], ['🍎', 'Mid-morning'], ['🍛', 'Lunch'], ['🍵', 'Evening snack'], ['🌙', 'Dinner']];

  function subst(text, a) {
    var t = text, d = allergic(a, 'dairy'), s = allergic(a, 'soy'), n = allergic(a, 'nuts'), g = allergic(a, 'gluten'), e = allergic(a, 'egg'), f = allergic(a, 'fish');
    if (f) { t = t.replace(/Fish curry \(rohu or surmai, 100 to 120 g\)/g, 'Chicken curry (100 to 120 g)').replace(/Grilled fish or paneer/g, 'Grilled chicken or paneer'); }
    if (e) {
      t = t.replace(/2-egg vegetable omelette/g, '2 besan chillas with vegetables').replace(/2-egg omelette/g, '2 besan chillas')
           .replace(/Egg bhurji \(2 eggs\)/g, 'Paneer or tofu bhurji (100 g)').replace(/egg curry \(2 eggs\)/g, 'chickpea curry')
           .replace(/Vegetable and egg stir-fry bowl/g, 'Vegetable and paneer stir-fry bowl').replace(/ \+ 1 boiled egg/g, ' + 1 small bowl sprouts');
    }
    if (d) {
      var plantMilk = s ? (n ? 'oat or rice milk' : 'oat or almond milk') : (n ? 'oat or soy milk' : 'soy or almond milk');
      t = t.replace(/1 glass soy or almond milk/g, '1 glass ' + plantMilk)
           .replace(/1 glass buttermilk/g, '1 glass fresh lime water').replace(/1 glass milk/g, '1 glass ' + plantMilk)
           .replace(/1 small bowl curd/g, '1 small bowl ' + (s ? 'coconut yoghurt' : 'plant-based yoghurt'))
           .replace(/palak paneer/g, s ? 'palak with chickpeas' : 'palak tofu')
           .replace(/Paneer or tofu bhurji/g, s ? 'Chickpea (besan) bhurji' : 'Tofu bhurji')
           .replace(/paneer bhurji/g, s ? 'chickpea (besan) bhurji' : 'tofu bhurji')
           .replace(/Grilled paneer/g, s ? 'Grilled chickpea (besan) cubes' : 'Grilled tofu').replace(/or paneer/g, s ? 'or chickpea cubes' : 'or tofu')
           .replace(/paneer and capsicum sabzi/g, s ? 'chickpea and capsicum sabzi' : 'tofu and capsicum sabzi')
           .replace(/paneer curry \(Jain style\)/g, s ? 'chickpea curry (Jain style)' : 'tofu curry (Jain style)')
           .replace(/vegetable and paneer/gi, function (m) { return m.replace(/paneer/, s ? 'chickpea' : 'tofu'); })
           .replace(/paneer/g, s ? 'chickpeas' : 'tofu');
    }
    if (s) {
      t = t.replace(/1 glass soy or almond milk/g, '1 glass ' + (n ? 'oat or rice milk' : 'oat or almond milk'))
           .replace(/tofu or soya-chunk curry/g, d ? 'chickpea curry' : 'paneer or chickpea curry')
           .replace(/Stir-fried tofu/g, d ? 'Stir-fried chickpea' : 'Stir-fried paneer').replace(/tofu bhurji/g, d ? 'chickpea bhurji' : 'paneer bhurji')
           .replace(/Tofu bhurji/g, d ? 'Chickpea bhurji' : 'Paneer bhurji')
           .replace(/Grilled tofu/g, 'Grilled chickpea (besan) cubes').replace(/\btofu\b/g, d ? 'chickpea' : 'paneer');
    }
    if (n) {
      t = t.replace(/1 glass oat or almond milk/g, '1 glass oat or rice milk').replace(/soy or almond milk/g, 'oat or soy milk')
           .replace(/with peanuts/g, 'with sunflower seeds').replace(/a handful of walnuts/g, 'a handful of pumpkin seeds')
           .replace(/5 almonds/g, '1 tbsp pumpkin seeds');
    }
    if (g) {
      t = t.replace(/ rotis\b/g, ' millet (jowar or bajra) rotis').replace(/ roti\b/g, ' millet (jowar or bajra) roti')
           .replace(/multigrain toast/g, 'gluten-free toast').replace(/Vegetable upma/g, 'Vegetable millet upma');
    }
    return t;
  }

  function buildMeals(a, r) {
    var plan = PLANS[a.diet] || PLANS.veg;
    var lunch = r.split[2], dinner = r.split[4];
    var R = Math.max(1, Math.min(5, Math.round(lunch * 0.40 / 95)));
    var R2 = Math.max(1, Math.min(4, Math.round(dinner * 0.35 / 95)));
    var C = Math.max(0.5, Math.min(2, Math.round(lunch * 0.35 / 200 * 2) / 2));
    return plan.map(function (day) {
      return day.map(function (m) {
        var t = m.replace(/\{R2\}/g, R2).replace(/\{R\}/g, R).replace(/\{C\}/g, C);
        t = t.replace(/\b(\d+) rotis?\b/g, function (x, n) { return n + (n === '1' ? ' roti' : ' rotis'); });
        return subst(t, a);
      });
    });
  }

  /* expose pure functions for testing / reuse */
  LAB.dietCalc = calc; LAB.dietMeals = buildMeals; LAB.dietQuality = quality;

  /* ───────────────────────── Styles ───────────────────────── */
  var css = document.createElement('style');
  css.id = 'wl-diet-css';
  css.textContent = [
    '.dq{max-width:640px;margin:0 auto}',
    '.dq-top{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin-bottom:.6rem;font-size:.75rem;color:#6A8A6A;font-weight:700}',
    '.dq-bar{height:8px;border-radius:8px;background:#E3EFE7;overflow:hidden;margin-bottom:1.1rem}',
    '.dq-bar i{display:block;height:100%;border-radius:8px;background:linear-gradient(90deg,#2A7A5A,#38A87A);transition:width .35s}',
    '.dq h2{font-family:"Playfair Display",serif;font-size:clamp(1.3rem,4.5vw,1.7rem);margin:0 0 .3rem;color:#1C2E1C}',
    '.dq-sub{font-size:.85rem;color:#3A5A3A;margin:0 0 1.2rem;line-height:1.55}',
    '.dq-lab{display:block;font-size:.76rem;font-weight:800;letter-spacing:.04em;color:#1C2E1C;margin:1.1rem 0 .45rem}',
    '.dq-lab small{font-weight:600;color:#6A8A6A;letter-spacing:0}',
    '.dq-row{display:flex;gap:.6rem;flex-wrap:wrap}',
    '.dq-row>*{flex:1 1 120px}',
    '.dq-in{width:100%;box-sizing:border-box;padding:.8rem .9rem;font:inherit;font-size:1rem;border:1.5px solid #D4E8DC;border-radius:12px;background:#fff;color:#1C2E1C}',
    '.dq-in:focus{outline:none;border-color:#2A7A5A;box-shadow:0 0 0 3px rgba(42,122,90,.15)}',
    '.dq-chips{display:flex;flex-wrap:wrap;gap:.5rem}',
    '.dq-chip{font:inherit;font-size:.85rem;font-weight:600;padding:.6rem .95rem;border-radius:50px;border:1.5px solid #D4E8DC;background:#fff;color:#1C2E1C;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:.4rem}',
    '.dq-chip:hover{border-color:#2A7A5A}',
    '.dq-chip.on{background:#2A7A5A;border-color:#2A7A5A;color:#fff;box-shadow:0 4px 12px rgba(42,122,90,.25)}',
    '.dq-opt{display:flex;align-items:center;gap:.8rem;width:100%;text-align:left;font:inherit;padding:.8rem 1rem;margin-bottom:.5rem;border-radius:14px;border:1.5px solid #D4E8DC;background:#fff;color:#1C2E1C;cursor:pointer;transition:all .15s}',
    '.dq-opt:hover{border-color:#2A7A5A}',
    '.dq-opt.on{border-color:#2A7A5A;background:#F0FAF4;box-shadow:0 0 0 3px rgba(42,122,90,.14)}',
    '.dq-opt .e{font-size:1.5rem;flex:0 0 auto}',
    '.dq-opt b{display:block;font-size:.92rem}',
    '.dq-opt span.d{display:block;font-size:.76rem;color:#6A8A6A}',
    '.dq-seg{display:inline-flex;border:1.5px solid #D4E8DC;border-radius:50px;overflow:hidden;margin-bottom:.5rem}',
    '.dq-seg button{font:inherit;font-size:.78rem;font-weight:700;padding:.4rem .9rem;border:0;background:#fff;color:#6A8A6A;cursor:pointer}',
    '.dq-seg button.on{background:#2A7A5A;color:#fff}',
    '.dq-live{margin-top:1.2rem;padding:.9rem 1rem;border-radius:14px;background:#F0FAF4;border:1.5px solid rgba(42,122,90,.2);display:none;align-items:center;gap:.8rem}',
    '.dq-live b{font-size:1.5rem;font-family:"JetBrains Mono",monospace}',
    '.dq-live span{font-size:.8rem;color:#3A5A3A}',
    '.dq-q{padding:.9rem 0;border-bottom:1px solid #E3EFE7}',
    '.dq-q:last-child{border-bottom:0}',
    '.dq-q p{margin:0 0 .5rem;font-size:.88rem;font-weight:700;color:#1C2E1C}',
    '.dq-err{display:none;margin-top:1rem;padding:.7rem .9rem;border-radius:12px;background:#FEF2F2;border:1.5px solid #FCA5A5;color:#991B1B;font-size:.82rem;font-weight:600}',
    '.dq-nav{display:flex;gap:.7rem;margin-top:1.4rem}',
    '.dq-nav .btn{flex:1}',
    '.dq-priv{margin:1rem 0 0;text-align:center;font-size:.72rem;color:#6A8A6A}',
    /* results */
    '.dr{max-width:760px;margin:0 auto}',
    '.dr-hero{padding:1.6rem 1.2rem;border-radius:22px;color:#fff;text-align:center;background:radial-gradient(circle at 90% 0,rgba(240,160,32,.3),transparent 45%),linear-gradient(135deg,#0f4d33,#2A7A5A 60%,#38A87A);box-shadow:0 14px 40px rgba(20,83,45,.25)}',
    '.dr-hero h2{font-family:"Playfair Display",serif;color:#fff;margin:0 0 .3rem;font-size:clamp(1.4rem,5vw,1.9rem)}',
    '.dr-hero p{margin:0;font-size:.86rem;color:rgba(255,255,255,.9)}',
    '.dr-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:.7rem;margin:1rem 0}',
    '@media(min-width:620px){.dr-stats{grid-template-columns:repeat(4,1fr)}}',
    '.dr-stat{background:#fff;border:1.5px solid #D4E8DC;border-radius:16px;padding:.9rem .6rem;text-align:center}',
    '.dr-stat small{display:block;font-size:.66rem;font-weight:800;letter-spacing:.08em;color:#6A8A6A;text-transform:uppercase}',
    '.dr-stat b{display:block;font-family:"JetBrains Mono",monospace;font-size:1.45rem;color:#1C2E1C;margin:.15rem 0}',
    '.dr-stat span{font-size:.72rem;font-weight:700}',
    '.dr-card{background:#fff;border:1.5px solid #D4E8DC;border-radius:18px;padding:1.2rem 1.1rem;margin-bottom:.9rem;box-shadow:0 2px 10px rgba(28,46,28,.04)}',
    '.dr-card h3{display:flex;align-items:center;gap:.5rem;margin:0 0 .7rem;font-size:1.02rem;color:#1C2E1C}',
    '.dr-card p{margin:.3rem 0;font-size:.85rem;line-height:1.6;color:#3A5A3A}',
    '.dr-note{padding:.75rem .9rem;margin:.6rem 0;border-radius:12px;background:#FFF8ED;border:1.5px solid rgba(201,120,0,.25);font-size:.82rem;line-height:1.55;color:#5a3a00}',
    '.dg{position:relative;display:flex;height:14px;border-radius:14px;overflow:hidden;margin:1.4rem 0 .4rem}',
    '.dg i{display:block;height:100%}',
    '.dg-mark{position:absolute;top:-6px;width:4px;height:26px;border-radius:3px;background:#1C2E1C;box-shadow:0 0 0 2px #fff}',
    '.dg-lbl{display:flex;justify-content:space-between;font-size:.62rem;color:#6A8A6A;font-weight:700}',
    '.dr-macro{display:flex;height:16px;border-radius:16px;overflow:hidden;margin:.6rem 0}',
    '.dr-mrow{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;text-align:center}',
    '.dr-mrow div{padding:.6rem .3rem;border-radius:12px;background:#F7FBF8}',
    '.dr-mrow b{display:block;font-size:1.15rem;font-family:"JetBrains Mono",monospace}',
    '.dr-mrow span{font-size:.7rem;color:#6A8A6A;font-weight:700}',
    '.dr-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:.3rem 0 .8rem}',
    '.dr-chips span{font-size:.78rem;padding:.35rem .7rem;border-radius:50px;background:#F0FAF4;border:1px solid rgba(42,122,90,.2);color:#1C2E1C}',
    '.dr-grp{font-size:.74rem;font-weight:800;letter-spacing:.06em;color:#2A7A5A;text-transform:uppercase;margin-top:.8rem}',
    '.dr-avoid{display:flex;gap:.7rem;padding:.7rem 0;border-bottom:1px solid #F0E4E4}',
    '.dr-avoid:last-child{border-bottom:0}',
    '.dr-avoid .x{flex:0 0 auto;width:1.6rem;height:1.6rem;border-radius:50%;background:#FEE2E2;color:#B91C1C;display:grid;place-items:center;font-size:.8rem;font-weight:800}',
    '.dr-avoid b{display:block;font-size:.86rem;color:#1C2E1C}',
    '.dr-avoid span{display:block;font-size:.76rem;color:#6A5A5A;line-height:1.5}',
    '.dr-tabs{display:flex;gap:.4rem;margin-bottom:.8rem}',
    '.dr-tabs button{flex:1;font:inherit;font-size:.82rem;font-weight:700;padding:.55rem;border-radius:12px;border:1.5px solid #D4E8DC;background:#fff;color:#6A8A6A;cursor:pointer}',
    '.dr-tabs button.on{background:#2A7A5A;border-color:#2A7A5A;color:#fff}',
    '.dr-meal{display:flex;gap:.7rem;padding:.65rem 0;border-bottom:1px solid #E3EFE7}',
    '.dr-meal:last-child{border-bottom:0}',
    '.dr-meal .e{flex:0 0 auto;font-size:1.4rem}',
    '.dr-meal b{display:flex;justify-content:space-between;gap:.5rem;font-size:.82rem;color:#1C2E1C}',
    '.dr-meal b em{font-style:normal;font-family:"JetBrains Mono",monospace;font-size:.7rem;color:#2A7A5A}',
    '.dr-meal span{display:block;font-size:.82rem;color:#3A5A3A;line-height:1.5}',
    '.dr-score{display:flex;align-items:center;gap:1rem}',
    '.dr-score .n{flex:0 0 auto;width:4.6rem;height:4.6rem;border-radius:50%;display:grid;place-items:center;font-family:"JetBrains Mono",monospace;font-size:1.4rem;font-weight:800;color:#fff}',
    '.dr-ul{margin:.3rem 0 0;padding-left:1.1rem}',
    '.dr-ul li{font-size:.84rem;line-height:1.6;color:#3A5A3A;margin-bottom:.3rem}',
    '.dr-cta{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.1rem 0}',
    '.dr-cta .btn{flex:1 1 150px}',
    '.dr-disc{font-size:.72rem;color:#6A8A6A;line-height:1.55;text-align:center;margin:1rem 0 2rem}',
    '@media print{body *{visibility:hidden}#sDiet,#sDiet *{visibility:visible}#sDiet{position:absolute;left:0;top:0;width:100%}.no-print{display:none!important}.dr-card,.dr-stat{break-inside:avoid}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ───────────────────────── Quiz state ───────────────────────── */
  var S = null;
  function fresh() { return { step: 1, sex: '', age: '', hUnit: 'cm', h: '', ft: '', inch: '', w: '', waist: '', hip: '', act: '', sleep: '', goal: '', pace: 'gentle', diet: '', allergies: [], conds: [], hab: {} }; }
  function load() {
    var s = fresh();
    try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved && typeof saved === 'object') { for (var k in s) { if (k !== 'step' && saved[k] !== undefined) s[k] = saved[k]; } } } catch (e) {}
    return s;
  }
  function save() { try { var c = {}; for (var k in S) { if (k !== 'step') c[k] = S[k]; } localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
  function track(n) { try { if (typeof trackWL === 'function') trackWL(n); } catch (e) {} }
  function root() { return $('dietRoot'); }
  function top() { try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); } }

  LAB.startDiet = function () {
    S = load(); S.step = 1;
    track('diet_start');
    this.show('sDiet');
    this.setStatus('active', 'Diet Lab');
    renderStep();
  };
  LAB.dietExit = function () { this.goWelcome(); };

  /* setters used by inline handlers */
  LAB._dSet = function (k, v) { S[k] = v; if (k === 'h' || k === 'ft' || k === 'inch' || k === 'w' || k === 'hUnit') liveBmi(); };
  LAB._dPick = function (k, v) { S[k] = v; renderStep(); };
  LAB._dToggle = function (k, v) {
    var i = S[k].indexOf(v);
    if (i >= 0) S[k].splice(i, 1); else S[k].push(v);
    renderStep(true);
  };
  LAB._dHab = function (id, i) { S.hab[id] = i; renderStep(true); };
  LAB._dUnit = function (u) { S.hUnit = u; renderStep(true); };

  function liveBmi() {
    var el = $('dqLive'); if (!el) return;
    var h = heightCm(S), w = num(S.w);
    if (!h || !w || h < 100 || h > 230 || w < 25 || w > 250) { el.style.display = 'none'; return; }
    var b = w / Math.pow(h / 100, 2);
    var c = b < 18.5 ? ['Underweight', '#2563EB'] : b < 23 ? ['Healthy weight', '#16A34A'] : b < 25 ? ['Overweight', '#F59E0B'] : b < 30 ? ['Obese (Class I)', '#EA580C'] : ['Obese (Class II)', '#DC2626'];
    el.style.display = 'flex';
    el.innerHTML = '<b style="color:' + c[1] + '">' + (Math.round(b * 10) / 10) + '</b><span>Your BMI right now: <strong style="color:' + c[1] + '">' + c[0] + '</strong>. Keep going for your full plan.</span>';
  }

  function chip(on, label, handler, extra) { return '<button type="button" class="dq-chip' + (on ? ' on' : '') + '" aria-pressed="' + (on ? 'true' : 'false') + '" onclick="' + handler + '">' + (extra || '') + esc(label) + '</button>'; }
  function opt(on, e, t, d, handler) { return '<button type="button" class="dq-opt' + (on ? ' on' : '') + '" aria-pressed="' + (on ? 'true' : 'false') + '" onclick="' + handler + '"><span class="e">' + e + '</span><span><b>' + esc(t) + '</b>' + (d ? '<span class="d">' + esc(d) + '</span>' : '') + '</span></button>'; }
  function val(v) { return v === '' || v === null || v === undefined ? '' : esc(v); }

  var STEP_HTML = {
    1: function () {
      return '<h2>Let\'s start with you</h2><p class="dq-sub">Your height and weight give us your BMI and daily calorie needs.</p>' +
        '<span class="dq-lab">I AM</span><div class="dq-chips">' + chip(S.sex === 'm', 'Male', "LAB._dPick('sex','m')", '👨 ') + chip(S.sex === 'f', 'Female', "LAB._dPick('sex','f')", '👩 ') + '</div>' +
        '<label class="dq-lab" for="dqAge">AGE <small>(years)</small></label><input id="dqAge" class="dq-in" type="number" inputmode="numeric" min="10" max="100" placeholder="e.g. 32" value="' + val(S.age) + '" oninput="LAB._dSet(\'age\',this.value)">' +
        '<span class="dq-lab">HEIGHT</span><div class="dq-seg"><button type="button" class="' + (S.hUnit === 'cm' ? 'on' : '') + '" onclick="LAB._dUnit(\'cm\')">cm</button><button type="button" class="' + (S.hUnit === 'ft' ? 'on' : '') + '" onclick="LAB._dUnit(\'ft\')">ft / in</button></div>' +
        (S.hUnit === 'cm'
          ? '<input id="dqH" class="dq-in" type="number" inputmode="decimal" min="100" max="230" placeholder="e.g. 170" value="' + val(S.h) + '" oninput="LAB._dSet(\'h\',this.value)" aria-label="Height in centimetres">'
          : '<div class="dq-row"><input class="dq-in" type="number" inputmode="numeric" min="3" max="7" placeholder="ft" value="' + val(S.ft) + '" oninput="LAB._dSet(\'ft\',this.value)" aria-label="Feet"><input class="dq-in" type="number" inputmode="numeric" min="0" max="11" placeholder="in" value="' + val(S.inch) + '" oninput="LAB._dSet(\'inch\',this.value)" aria-label="Inches"></div>') +
        '<label class="dq-lab" for="dqW">WEIGHT <small>(kg)</small></label><input id="dqW" class="dq-in" type="number" inputmode="decimal" min="25" max="250" placeholder="e.g. 68" value="' + val(S.w) + '" oninput="LAB._dSet(\'w\',this.value)">' +
        '<div class="dq-live" id="dqLive" aria-live="polite"></div>';
    },
    2: function () {
      return '<h2>Your body and daily activity</h2><p class="dq-sub">Waist and hip are optional, but they tell us more about your health than weight alone.</p>' +
        '<div class="dq-row"><div><label class="dq-lab" for="dqWa" style="margin-top:0">WAIST <small>(cm, optional)</small></label><input id="dqWa" class="dq-in" type="number" inputmode="decimal" placeholder="at the navel" value="' + val(S.waist) + '" oninput="LAB._dSet(\'waist\',this.value)"></div>' +
        '<div><label class="dq-lab" for="dqHi" style="margin-top:0">HIPS <small>(cm, optional)</small></label><input id="dqHi" class="dq-in" type="number" inputmode="decimal" placeholder="widest part" value="' + val(S.hip) + '" oninput="LAB._dSet(\'hip\',this.value)"></div></div>' +
        '<span class="dq-lab">HOW ACTIVE ARE YOU?</span>' + ACT.map(function (x) { return opt(S.act === x.id, x.e, x.t, x.d, "LAB._dPick('act','" + x.id + "')"); }).join('') +
        '<span class="dq-lab">SLEEP PER NIGHT</span><div class="dq-chips">' + SLEEP.map(function (x) { return chip(S.sleep === x[0], x[1], "LAB._dPick('sleep','" + x[0] + "')"); }).join('') + '</div>';
    },
    3: function () {
      return '<h2>What is your goal?</h2><p class="dq-sub">We will set your calories and protein to match.</p>' +
        GOALS.map(function (x) { return opt(S.goal === x.id, x.e, x.t, x.d, "LAB._dPick('goal','" + x.id + "')"); }).join('') +
        (S.goal === 'lose' ? '<span class="dq-lab">HOW FAST?</span><div class="dq-chips">' + chip(S.pace === 'gentle', 'Gentle and easy', "LAB._dPick('pace','gentle')") + chip(S.pace === 'steady', 'Steady', "LAB._dPick('pace','steady')") + '</div><p class="dq-sub" style="margin-top:.6rem">Slow and steady is easier to keep up. We never go below safe calorie limits.</p>' : '');
    },
    4: function () {
      return '<h2>What do you eat?</h2><p class="dq-sub">We will build your meal plan with foods you can eat.</p>' +
        '<span class="dq-lab" style="margin-top:0">MY DIET</span>' + DIETS.map(function (x) { return opt(S.diet === x.id, x.e, x.t, '', "LAB._dPick('diet','" + x.id + "')"); }).join('') +
        '<span class="dq-lab">ANY FOOD ALLERGIES OR INTOLERANCES? <small>(skip if none)</small></span><div class="dq-chips">' +
        ALLERGIES.map(function (x) { return chip(allergic(S, x.id), x.t, "LAB._dToggle('allergies','" + x.id + "')"); }).join('') + '</div>';
    },
    5: function () {
      var list = CONDS.filter(function (c) { return !(c.f && S.sex === 'm'); });
      return '<h2>Any health conditions?</h2><p class="dq-sub">Select all that apply, or skip if none. This only changes the advice we show you.</p>' +
        '<div class="dq-chips">' + list.map(function (x) { return chip(has(S, x.id), x.t, "LAB._dToggle('conds','" + x.id + "')"); }).join('') + '</div>' +
        '<p class="dq-priv" style="text-align:left;margin-top:1rem">Your answers stay on your device.</p>';
    },
    6: function () {
      return '<h2>Your eating habits</h2><p class="dq-sub">Be honest, there are no wrong answers. This gives you a Diet Quality Score.</p>' +
        HAB.map(function (q) {
          return '<div class="dq-q"><p>' + esc(q.q) + '</p><div class="dq-chips">' +
            q.o.map(function (o, i) { return chip(S.hab[q.id] === i, o[0], "LAB._dHab('" + q.id + "'," + i + ")"); }).join('') + '</div></div>';
        }).join('');
    }
  };

  function validate(step) {
    if (step === 1) {
      var age = num(S.age), h = heightCm(S), w = num(S.w);
      if (!S.sex) return 'Please choose Male or Female.';
      if (age === null || age < 10 || age > 100) return 'Please enter your age (10 to 100 years).';
      if (!h || h < 100 || h > 230) return 'Please enter a height between 100 and 230 cm (3 ft 3 in to 7 ft 6 in).';
      if (w === null || w < 25 || w > 250) return 'Please enter a weight between 25 and 250 kg.';
    }
    if (step === 2) {
      var wa = num(S.waist), hi = num(S.hip);
      if (S.waist !== '' && (wa === null || wa < 40 || wa > 200)) return 'Waist should be between 40 and 200 cm, or leave it blank.';
      if (S.hip !== '' && (hi === null || hi < 50 || hi > 220)) return 'Hips should be between 50 and 220 cm, or leave it blank.';
      if (!S.act) return 'Please tell us how active you are.';
      if (!S.sleep) return 'Please choose your usual sleep hours.';
    }
    if (step === 3 && !S.goal) return 'Please choose a goal.';
    if (step === 4 && !S.diet) return 'Please choose your diet type.';
    if (step === 6 && HAB.some(function (q) { return S.hab[q.id] === undefined; })) return 'Please answer every question. It takes under a minute.';
    return '';
  }

  function renderStep(keepScroll) {
    var n = S.step, pct = Math.round((n - 1) / STEPS * 100);
    var h = '<div class="dq card card--pop">' +
      '<div class="dq-top"><span>Step ' + n + ' of ' + STEPS + ' · ' + STEP_NAMES[n - 1] + '</span><span>🥗 Diet Lab</span></div>' +
      '<div class="dq-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i style="width:' + Math.max(6, pct) + '%"></i></div>' +
      STEP_HTML[n]() +
      '<div class="dq-err" id="dqErr" role="alert"></div>' +
      '<div class="dq-nav"><button type="button" class="btn btn--g btn--lg" onclick="LAB._dBack()">← Back</button>' +
      '<button type="button" class="btn btn--p btn--lg" onclick="LAB._dNext()">' + (n === STEPS ? 'See my plan ✨' : 'Next →') + '</button></div>' +
      '<p class="dq-priv">🔐 Private. Nothing leaves your device. General guidance, not medical advice.</p></div>';
    root().innerHTML = h;
    if (n === 1) liveBmi();
    if (!keepScroll) top();
  }

  LAB._dBack = function () { if (S.step === 1) { save(); this.dietExit(); } else { S.step--; renderStep(); } };
  LAB._dNext = function () {
    var err = validate(S.step), box = $('dqErr');
    if (err) { if (box) { box.textContent = err; box.style.display = 'block'; try { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {} } return; }
    save();
    if (S.step < STEPS) { S.step++; renderStep(); }
    else { track('diet_complete'); renderResults(); }
  };

  /* ───────────────────────── Results ───────────────────────── */
  function card(emoji, title, body) { return '<div class="dr-card"><h3><span>' + emoji + '</span>' + esc(title) + '</h3>' + body + '</div>'; }
  function ul(items) { return '<ul class="dr-ul">' + items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>'; }
  function actions() {
    return '<div class="dr-cta no-print"><button class="btn btn--p btn--lg" onclick="LAB._dShare()">💬 Share on WhatsApp</button>' +
      '<button class="btn btn--g btn--lg" onclick="window.print()">🖨 Print / Save PDF</button>' +
      '<button class="btn btn--g btn--lg" onclick="LAB._dRetake()">↺ Retake</button></div>' +
      '<div class="dr-cta no-print"><button class="btn btn--g btn--lg" onclick="LAB.dietExit()">← Back to Wellness Lab</button>' +
      '<a class="btn btn--g btn--lg" href="products.html" style="text-align:center;text-decoration:none">🌿 Explore our Ayurvedic range</a></div>';
  }
  var DISC = '<p class="dr-disc">This plan is general wellness guidance based on standard formulas (Mifflin-St Jeor) and Asian BMI cut-offs. It is not medical advice and does not replace a doctor or registered dietitian. If you have a medical condition, take medicines, or are pregnant, please check with your doctor before changing your diet.</p>';

  var DISC_SHORT = '<p class="dr-disc">This is general wellness information, not medical advice. Please speak with a doctor or registered dietitian about your own situation.</p>';

  function restrictedHTML(a, r) {
    var msg = {
      ed: ['💛', 'Let\'s keep this gentle', 'Because you mentioned an eating disorder, we are not going to give you calorie numbers or weight targets here. Those can make recovery harder. Please speak to your doctor or a mental health professional, who can build a plan that supports you safely. If you are struggling right now, reach out to someone you trust today.'],
      teen: ['🌱', 'Teens need a personal plan', 'Growing bodies need a plan from a paediatrician or registered dietitian, and BMI is read differently for children and teenagers. Until then, focus on regular meals, plenty of vegetables and fruit, enough protein, water, sleep and play.'],
      kid: ['🩺', 'Kidney disease needs a personal plan', 'With kidney disease, the right amount of protein, potassium, phosphorus, salt and fluid is very individual. Please follow the diet from your nephrologist or renal dietitian rather than a general plan.']
    }[r.restrict];
    var bmiBlock = r.restrict === 'ed' ? '' : card('📏', 'Your BMI', '<p><strong>' + r.bmi + '</strong>' + (r.restrict === 'teen' ? ' (adult categories do not apply under 18, so please ask your doctor how to read this)' : ' (' + r.cat[0] + ', Asian cut-offs)') + '</p>');
    return '<div class="dr"><div class="dr-hero"><h2>' + msg[1] + '</h2><p>' + msg[0] + ' We care about your safety first</p></div>' +
      '<div style="margin-top:1rem">' + card(msg[0], msg[1], '<p>' + esc(msg[2]) + '</p>') + bmiBlock + '</div>' + actions() + DISC_SHORT + '</div>';
  }

  function renderResults() {
    var a = S, r = calc(a);
    LAB._dLast = { a: a, r: r };
    if (r.restrict) { root().innerHTML = restrictedHTML(a, r); top(); return; }
    var q = quality(a), meals = buildMeals(a, r);
    var goalTxt = { lose: 'weight loss', gain: 'gentle weight gain', maintain: 'staying at your weight' }[r.goal];
    var m = r.macros;

    /* BMI gauge: scale 14 to 36 */
    var seg = [[4.5, '#60A5FA'], [4.5, '#4ADE80'], [2, '#FBBF24'], [5, '#FB923C'], [6, '#F87171']];
    var tot = 22, pos = Math.max(2, Math.min(98, (r.bmi - 14) / tot * 100));
    var gauge = '<div class="dg">' + seg.map(function (s) { return '<i style="width:' + (s[0] / tot * 100) + '%;background:' + s[1] + '"></i>'; }).join('') + '<span class="dg-mark" style="left:calc(' + pos + '% - 2px)"></span></div>' +
      '<div class="dg-lbl"><span>14</span><span>18.5</span><span>23</span><span>25</span><span>30</span><span>36+</span></div>';
    var rangeTxt = '<p>A healthy weight for your height is about <strong>' + r.wMin + ' to ' + r.wMax + ' kg</strong>.' +
      (r.bmi >= 23 ? ' You are about <strong>' + Math.round((r.w - r.wMax) * 10) / 10 + ' kg</strong> above the top of this range.' : r.bmi < 18.5 ? ' You are about <strong>' + Math.round((r.wMin - r.w) * 10) / 10 + ' kg</strong> below the bottom of this range.' : ' You are within this range. Well done!') + '</p>';
    var body = '';
    if (r.weeks && r.weeks < 200) {
      var months = Math.round(r.weeks / 4.3);
      rangeTxt += '<p>At about <strong>' + r.perWeek + ' kg a week</strong>, reaching it would take roughly <strong>' + (r.weeks > 12 ? months + ' months' : r.weeks + ' weeks') + '</strong>. Real progress varies, so treat this as a rough guide.</p>';
    }
    var extra = '';
    if (r.waist) {
      extra += '<p>Waist: <strong>' + r.waist + ' cm</strong> ' + (r.waistHigh ? '(above the ' + (r.male ? '90' : '80') + ' cm Asian guideline, which means extra belly-fat risk)' : '(within the Asian guideline of under ' + (r.male ? '90' : '80') + ' cm)') + '. Waist-to-height ratio: <strong>' + r.whtr + '</strong> (under 0.5 is ideal).</p>';
    }
    if (r.whr) extra += '<p>Waist-to-hip ratio: <strong>' + r.whr + '</strong> ' + (r.whrHigh ? '(higher than the recommended ' + (r.male ? '0.90' : '0.85') + ')' : '(healthy)') + '.</p>';

    var statTiles = '<div class="dr-stats">' +
      '<div class="dr-stat"><small>BMI</small><b>' + r.bmi + '</b><span style="color:' + r.cat[1] + '">' + r.cat[0] + '</span></div>' +
      '<div class="dr-stat"><small>Calories</small><b>' + r.kcal + '</b><span style="color:#2A7A5A">kcal / day</span></div>' +
      '<div class="dr-stat"><small>Protein</small><b>' + m.p + 'g</b><span style="color:#2A7A5A">per day</span></div>' +
      '<div class="dr-stat"><small>Water</small><b>' + r.water + 'L</b><span style="color:#2A7A5A">per day</span></div></div>';

    var html = '<div class="dr"><div class="dr-hero"><h2>Your personal nutrition plan</h2><p>Built for ' + goalTxt + ' · ' + (DIETS.filter(function (d) { return d.id === a.diet; })[0].t) + '</p></div>' + statTiles;
    r.notes.forEach(function (n) { html += '<div class="dr-note">💡 ' + esc(n) + '</div>'; });

    html += card('📏', 'Your BMI', gauge + rangeTxt + extra + '<p style="font-size:.74rem;color:#6A8A6A">We use Asian BMI cut-offs (overweight from 23, obese from 25), which suit Indians better. WHO\'s international cut-offs are slightly higher.</p>');

    html += card('🔥', 'Calories and macros',
      '<p>Your body burns about <strong>' + r.bmr + ' kcal</strong> at rest and <strong>' + r.tdee + ' kcal</strong> with your activity. Your target is <strong>' + r.kcal + ' kcal a day</strong>.</p>' +
      '<div class="dr-macro"><i style="width:' + m.pPct + '%;background:#2A7A5A"></i><i style="width:' + m.cPct + '%;background:#F0A020"></i><i style="width:' + m.fPct + '%;background:#60A5FA"></i></div>' +
      '<div class="dr-mrow"><div><b style="color:#2A7A5A">' + m.p + ' g</b><span>Protein · ' + m.pPct + '%</span></div><div><b style="color:#C97800">' + m.c + ' g</b><span>Carbs · ' + m.cPct + '%</span></div><div><b style="color:#2563EB">' + m.f + ' g</b><span>Fat · ' + m.fPct + '%</span></div></div>' +
      '<p>Aim for at least <strong>' + r.fibre + ' g of fibre</strong> a day (dals, vegetables, fruit, whole grains). Spread your calories across the day:</p>' +
      '<div class="dr-chips">' + SLOTS.map(function (s, i) { return '<span>' + s[0] + ' ' + s[1] + ' · ~' + r.split[i] + ' kcal</span>'; }).join('') + '</div>');

    html += card('✅', 'Foods to eat', eatGroups(a, r).map(function (g) {
      return '<div class="dr-grp">' + g.e + ' ' + esc(g.t) + '</div><div class="dr-chips">' + g.items.map(function (i) { return '<span>' + esc(i) + '</span>'; }).join('') + '</div>';
    }).join(''));

    html += card('🚫', 'Foods to limit or avoid', avoidList(a, r, q).map(function (x) { return '<div class="dr-avoid"><span class="x">✕</span><div><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div></div>'; }).join(''));

    var cn = condNotes(a);
    if (cn.length) html += card('🩺', 'For your health conditions', cn.map(function (c) { return '<div class="dr-grp">' + esc(c[0]) + '</div>' + ul(c[1]); }).join('') + '<p style="font-size:.74rem;color:#6A8A6A">Please check any changes with your doctor, especially if you take medicines.</p>');

    html += card('📅', 'Your 3-day sample meal plan',
      '<div class="dr-tabs no-print">' + [1, 2, 3].map(function (d) { return '<button type="button" class="' + (d === 1 ? 'on' : '') + '" data-d="' + d + '" onclick="LAB._dDay(' + d + ')">Day ' + d + '</button>'; }).join('') + '</div>' +
      meals.map(function (day, di) {
        return '<div class="dr-day" data-d="' + (di + 1) + '" style="' + (di ? 'display:none' : '') + '">' + day.map(function (txt, i) {
          return '<div class="dr-meal"><span class="e">' + SLOTS[i][0] + '</span><div><b>' + SLOTS[i][1] + '<em>~' + r.split[i] + ' kcal</em></b><span>' + esc(txt) + '</span></div></div>';
        }).join('') + '</div>';
      }).join('') +
      '<p style="font-size:.76rem;color:#6A8A6A;margin-top:.8rem">Portions are matched to your calories. Swap meals between days, and use the same foods in other forms. Cook with the oil allowance above.' + (a.diet === 'jain' ? ' Have dinner before sunset if that is part of your practice.' : '') + '</p>');

    var scoreCol = q.score >= 75 ? '#16A34A' : q.score >= 50 ? '#F59E0B' : '#DC2626';
    var scoreMsg = q.score >= 75 ? 'Great habits! A few tweaks will make them even better.' : q.score >= 50 ? 'A solid start, with some easy wins available.' : 'Plenty of room to improve, and small changes add up fast.';
    var tips = q.low.slice(0, 4).map(function (x) { return x.q.tip; });
    if (q.sleepTip) tips.push(q.sleepTip);
    html += card('🏅', 'Your Diet Quality Score',
      '<div class="dr-score"><div class="n" style="background:' + scoreCol + '">' + q.score + '</div><div><p style="margin:0;font-weight:700;color:#1C2E1C">' + scoreMsg + '</p><p style="margin:.2rem 0 0;font-size:.76rem">Score out of 100, from your eating habits.</p></div></div>' +
      (tips.length ? '<div class="dr-grp">Your top 3 to 5 habit tips</div>' + ul(tips) : ''));

    html += card('🌿', 'Traditional Ayurvedic eating habits', ul(AYU) + '<p style="font-size:.74rem;color:#6A8A6A">These are traditional lifestyle tips, not treatments for any condition.</p>');

    html += actions() + DISC + '</div>';
    root().innerHTML = html;
    top();
  }

  LAB._dDay = function (d) {
    var days = document.querySelectorAll('#dietRoot .dr-day'), tabs = document.querySelectorAll('#dietRoot .dr-tabs button');
    Array.prototype.forEach.call(days, function (e) { e.style.display = e.getAttribute('data-d') == d ? '' : 'none'; });
    Array.prototype.forEach.call(tabs, function (b) { b.className = b.getAttribute('data-d') == d ? 'on' : ''; });
  };
  LAB._dRetake = function () { S.step = 1; renderStep(); };
  LAB._dShare = function () {
    var L = LAB._dLast; if (!L || !L.r || L.r.restrict) return;
    var r = L.r;
    var txt = 'My Shah Hayaat Wellness Lab diet plan:\nBMI ' + r.bmi + ' (' + r.cat[0] + ')\nCalories: ' + r.kcal + ' kcal/day\nProtein: ' + r.macros.p + ' g · Water: ' + r.water + ' L\nTry your free plan: https://www.shahhayaat.com/wellness-lab.html';
    window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank', 'noopener');
  };
})();
