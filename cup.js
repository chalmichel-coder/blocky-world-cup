"use strict";

// Coupe du monde façon 2026 : 48 équipes tirées au sort, 12 poules de 4 (A à L),
// les 2 premiers + les 8 meilleurs troisièmes en seizièmes, puis huitièmes, quarts,
// demies, match pour la 3e place et finale. Seuls les matchs du joueur sont joués,
// les autres sont simulés selon la force des équipes.
window.BWC_CUP=(function(){
// Force approximative de chaque sélection (sert au tirage par chapeaux et aux matchs simulés).
const RATING={
"Espagne":92,"Argentine":91,"France":91,"Angleterre":89,"Brésil":89,"Portugal":87,"Allemagne":86,"Pays-Bas":85,"Belgique":82,"Italie":82,
"Croatie":81,"Uruguay":81,"Colombie":81,"Maroc":81,"Japon":79,"États-Unis":78,"Mexique":78,"Suisse":78,"Danemark":78,"Sénégal":78,
"Norvège":77,"Autriche":77,"Équateur":77,"Turquie":76,"Corée du Sud":76,"Serbie":75,"Ukraine":75,"Pologne":75,"Suède":75,"Iran":75,
"Nigeria":75,"Australie":74,"Canada":74,"Tchéquie":74,"Écosse":74,"Hongrie":74,"Égypte":74,"Côte d'Ivoire":74,"Algérie":73,"Paraguay":73,
"Cameroun":73,"Slovaquie":72,"Slovénie":72,"Grèce":72,"Pays de Galles":72,"Russie":72,"Tunisie":72,"Ghana":72,"Roumanie":71,"Chili":71,
"Pérou":70,"Irlande":70,"Bosnie-Herzégovine":70,"Costa Rica":69,"Panama":69,"Arabie saoudite":69,"RD Congo":69,"Qatar":68,"Islande":68,"Afrique du Sud":68,
"Ouzbékistan":68,"Jordanie":68,"Irak":67,"Israël":67,"Cap-Vert":67,"Jamaïque":66,"Bulgarie":66,"Irlande du Nord":66,"Honduras":65,"Bolivie":65,
"Nouvelle-Zélande":65,"Émirats arabes unis":65,"Chine":64,"Haïti":63,"Curaçao":63,"Indonésie":63,"Angola":63,"Togo":62,"Trinité-et-Tobago":61,"Salvador":61,
"Corée du Nord":61,"Koweït":59,"Cuba":58,"Cambodge":55
};
const GROUPS="ABCDEFGHIJKL".split("");
const ROUNDS=["r32","r16","qf","sf","final"];
const rating=n=>RATING[n]||64;
const shuffle=list=>{for(let i=list.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]]}return list};
function poisson(lambda){let l=Math.exp(-lambda),k=0,p=1;do{k++;p*=Math.random()}while(p>l);return k-1}
// Score simulé : plus l'écart de force est grand, plus le favori marque.
function simScore(a,b){let d=(rating(a)-rating(b))/18;return[poisson(Math.max(.2,1.3*Math.exp(d*.55))),poisson(Math.max(.2,1.3*Math.exp(-d*.55)))]}
function penaltyWinner(a,b){return Math.random()<.5+(rating(a)-rating(b))/100?a:b}

function create(home,allCountries){
  let pool=shuffle(allCountries.filter(n=>n!==home)).slice(0,47),teams=[home,...pool].sort((x,y)=>rating(y)-rating(x)+(Math.random()-.5)*4);
  // 4 chapeaux de 12 : chaque poule reçoit une équipe de chaque chapeau.
  let groups=GROUPS.map(name=>({name,teams:[],matches:[]}));
  for(let pot=0;pot<4;pot++){let draw=shuffle(teams.slice(pot*12,pot*12+12));draw.forEach((n,i)=>groups[i].teams.push(n))}
  for(let g of groups){let [a,b,c,d]=shuffle(g.teams.slice());g.order=[a,b,c,d];g.matches=[[a,b],[c,d],[a,c],[d,b],[d,a],[b,c]].map(([x,y],i)=>({a:x,b:y,day:Math.floor(i/2),ga:null,gb:null}))}
  let lots={};for(let n of teams)lots[n]=Math.random();
  return{home,groups,lots,stage:"group",day:0,ko:{},thirds:[],status:"alive",place:null,history:[]};
}
function groupOf(cup,name){return cup.groups.find(g=>g.teams.includes(name))}
function table(cup,g){
  let rows={};for(let n of g.teams)rows[n]={name:n,group:g.name,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0};
  for(let m of g.matches){if(m.ga===null)continue;let A=rows[m.a],B=rows[m.b];A.p++;B.p++;A.gf+=m.ga;A.ga+=m.gb;B.gf+=m.gb;B.ga+=m.ga;if(m.ga>m.gb){A.w++;B.l++;A.pts+=3}else if(m.ga<m.gb){B.w++;A.l++;B.pts+=3}else{A.d++;B.d++;A.pts++;B.pts++}}
  return Object.values(rows).sort((x,y)=>rankCompare(cup,x,y));
}
function rankCompare(cup,x,y){return y.pts-x.pts||(y.gf-y.ga)-(x.gf-x.ga)||y.gf-x.gf||cup.lots[y.name]-cup.lots[x.name]}
function bestThirds(cup){return cup.groups.map(g=>table(cup,g)[2]).sort((x,y)=>rankCompare(cup,x,y))}

// Prochain match du joueur : { opponent, stage, day } ou null si la Coupe est finie.
function nextMatch(cup){
  if(cup.status!=="alive")return null;
  if(cup.stage==="group"){let m=groupOf(cup,cup.home).matches.find(x=>x.day===cup.day&&(x.a===cup.home||x.b===cup.home));return{opponent:m.a===cup.home?m.b:m.a,stage:"group",day:cup.day,group:groupOf(cup,cup.home).name}}
  let m=cup.ko[cup.stage].find(x=>x.a===cup.home||x.b===cup.home);return{opponent:m.a===cup.home?m.b:m.a,stage:cup.stage}
}
function playKo(m,ga,gb,pensWinner){m.ga=ga;m.gb=gb;m.winner=ga>gb?m.a:gb>ga?m.b:pensWinner;m.pens=ga===gb}
function simKo(m){let [ga,gb]=simScore(m.a,m.b);playKo(m,ga,gb,ga===gb?penaltyWinner(m.a,m.b):null)}

// Seizièmes : vainqueurs contre troisièmes / deuxièmes, sans revoir un adversaire de sa poule.
function buildR32(cup){
  let tables=cup.groups.map(g=>table(cup,g)),firsts=tables.map(t=>t[0]).sort((x,y)=>rankCompare(cup,x,y)),seconds=tables.map(t=>t[1]).sort((x,y)=>rankCompare(cup,x,y)),thirds=bestThirds(cup);
  cup.thirds=thirds.map(r=>r.name);
  let qualifiedThirds=thirds.slice(0,8),opponents=[...qualifiedThirds.slice().reverse(),...seconds.slice(8).reverse()],pairs=[];
  for(let i=0;i<12;i++)pairs.push([firsts[i],opponents[i]]);
  let rest=seconds.slice(0,8);for(let i=0;i<4;i++)pairs.push([rest[i],rest[7-i]]);
  // Échanges pour éviter deux équipes de la même poule.
  for(let k=0;k<4;k++)for(let i=0;i<pairs.length;i++)if(pairs[i][0].group===pairs[i][1].group)for(let j=0;j<pairs.length;j++){if(j===i)continue;if(pairs[j][0].group!==pairs[i][1].group&&pairs[i][0].group!==pairs[j][1].group){[pairs[i][1],pairs[j][1]]=[pairs[j][1],pairs[i][1]];break}}
  // Placement façon tableau de tennis : les meilleurs se retrouvent le plus tard possible.
  let seedOrder=[0,15,7,8,3,12,4,11,1,14,6,9,2,13,5,10];
  cup.ko.r32=seedOrder.map(i=>({a:pairs[i][0].name,b:pairs[i][1].name,ga:null,gb:null}));
}
function nextRound(cup,round){let prev=cup.ko[round],out=[];for(let i=0;i<prev.length;i+=2)out.push({a:prev[i].winner,b:prev[i+1].winner,ga:null,gb:null});return out}
function buildFinals(cup){cup.ko.final=[{a:cup.ko.sf[0].winner,b:cup.ko.sf[1].winner,ga:null,gb:null}];let losers=cup.ko.sf.map(m=>m.winner===m.a?m.b:m.a);cup.ko.third=[{a:losers[0],b:losers[1],ga:null,gb:null}]}
// Une fois le joueur éliminé, on joue le reste de la Coupe pour connaître le champion.
function simulateRest(cup){
  for(let i=0;i<ROUNDS.length;i++){let r=ROUNDS[i];
    if(r==="final"){if(!cup.ko.final)buildFinals(cup);for(let m of [...cup.ko.third,...cup.ko.final])if(m.ga===null)simKo(m);break}
    if(!cup.ko[r])cup.ko[r]=nextRound(cup,ROUNDS[i-1]);
    for(let m of cup.ko[r])if(m.ga===null)simKo(m);
  }
}

// Enregistre le match du joueur, simule le reste de la journée / du tour et avance la Coupe.
// Renvoie un résumé : { kind, ... } pour l'écran de fin.
function record(cup,homeGoals,awayGoals,pensWon){
  let info={stage:cup.stage,day:cup.day};
  if(cup.stage==="group"){
    let g=groupOf(cup,cup.home);
    for(let grp of cup.groups)for(let m of grp.matches){if(m.day!==cup.day||m.ga!==null)continue;if(grp===g&&(m.a===cup.home||m.b===cup.home)){m.ga=m.a===cup.home?homeGoals:awayGoals;m.gb=m.a===cup.home?awayGoals:homeGoals}else[m.ga,m.gb]=simScore(m.a,m.b)}
    cup.day++;
    if(cup.day<3)return{...info,kind:"group"};
    buildR32(cup);
    let rows=table(cup,g),pos=rows.findIndex(r=>r.name===cup.home)+1,thirdRank=cup.thirds.indexOf(cup.home)+1;
    let qualified=pos<=2||(pos===3&&thirdRank<=8);
    if(!qualified){cup.status="out";cup.place="group";simulateRest(cup)}else cup.stage="r32";
    return{...info,kind:"groupEnd",pos,thirdRank,qualified,group:g.name};
  }
  let round=cup.stage,list=cup.ko[round];
  for(let m of list){if(m.a===cup.home||m.b===cup.home){let mine=m.a===cup.home;playKo(m,mine?homeGoals:awayGoals,mine?awayGoals:homeGoals,homeGoals===awayGoals?(pensWon?cup.home:(mine?m.b:m.a)):null)}else if(m.ga===null)simKo(m)}
  let won=list.find(m=>m.a===cup.home||m.b===cup.home).winner===cup.home;
  if(round==="sf"){
    // Les deux perdants des demies jouent le match pour la 3e place.
    buildFinals(cup);
    if(won){simKo(cup.ko.third[0]);cup.stage="final"}else{simKo(cup.ko.final[0]);cup.stage="third"}
    return{...info,kind:"ko",won};
  }
  if(round==="third"){cup.status="done";cup.place=won?3:4;return{...info,kind:"ko",won}}
  if(round==="final"){cup.status="done";cup.place=won?1:2;return{...info,kind:"ko",won}}
  if(!won){cup.status="out";cup.place=round;simulateRest(cup);return{...info,kind:"ko",won}}
  let next=ROUNDS[ROUNDS.indexOf(round)+1];cup.ko[next]=nextRound(cup,round);cup.stage=next;
  return{...info,kind:"ko",won};
}
// Classement final des 48 équipes (Coupe terminée) : 1-4 par les finales, puis par tour atteint,
// et à tour égal par les résultats de poule.
function ranking(cup){
  let all=cup.groups.flatMap(g=>table(cup,g)),byName={};for(let r of all)byName[r.name]=r;
  let loser=m=>m&&m.winner?(m.winner===m.a?m.b:m.a):null,placed=[],seen=new Set(),push=(names,round)=>{let rows=names.filter(n=>n&&!seen.has(n)).map(n=>byName[n]).sort((x,y)=>rankCompare(cup,x,y));for(let r of rows){seen.add(r.name);placed.push({name:r.name,round})}};
  let f=cup.ko.final&&cup.ko.final[0],th=cup.ko.third&&cup.ko.third[0];
  if(f&&f.winner){push([f.winner],"final");push([loser(f)],"final")}
  if(th&&th.winner){push([th.winner],"third");push([loser(th)],"third")}
  for(let r of ["qf","r16","r32"])push((cup.ko[r]||[]).map(loser),r);
  push(all.map(r=>r.name),"group");
  return placed.map((x,i)=>({...x,place:i+1}));
}
return{create,nextMatch,record,table,bestThirds,groupOf,rating,ranking,GROUPS};
})();
