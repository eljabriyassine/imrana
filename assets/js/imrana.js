// Fill these in when ready (used by the contact form)
var SITE={email:'',whatsapp:''};
document.querySelector('.burger').onclick=function(){document.querySelector('nav ul').classList.toggle('open')};
var d=document.getElementById('lb');
document.querySelectorAll('.report').forEach(function(b){b.onclick=function(){d.querySelector('img').src=b.dataset.full;d.querySelector('img').alt=b.dataset.alt;d.showModal()}});
if(d){d.onclick=function(e){if(e.target===d||e.target.tagName==='BUTTON')d.close()}}
var f=document.getElementById('contact');
if(f)f.onsubmit=function(e){e.preventDefault();var n=document.getElementById('msg');
 if(!SITE.email){n.textContent='Messaging is not switched on yet. Please check back soon.';return}
 location.href='mailto:'+SITE.email+'?subject='+encodeURIComponent('Enquiry from '+f.name.value+' ('+f.goal.value+')')+'&body='+encodeURIComponent(f.message.value+'\n\n'+f.email.value)};
// scroll reveals + score count-up
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
if('IntersectionObserver' in window&&!rm){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});document.querySelectorAll('.reveal').forEach(function(x){io.observe(x)})}else document.querySelectorAll('.reveal').forEach(function(x){x.classList.add('in')});
if(!rm)document.querySelectorAll('[data-n]').forEach(function(el){var t=parseFloat(el.dataset.n),s=performance.now()+300;(function f(n){var p=Math.min(Math.max((n-s)/1100,0),1);el.textContent=(t*(1-Math.pow(1-p,3))).toFixed(1);if(p<1)requestAnimationFrame(f)})(performance.now())});
// skill tabs (keyboard: arrow keys)
document.querySelectorAll('[role=tablist]').forEach(function(l){var t=[].slice.call(l.querySelectorAll('[role=tab]'));
 function go(i){t.forEach(function(b,j){var on=i===j;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;document.getElementById(b.getAttribute('aria-controls')).hidden=!on});t[i].focus()}
 t.forEach(function(b,i){b.tabIndex=i?-1:0;b.onclick=function(){go(i)};b.onkeydown=function(e){if(e.key==='ArrowRight')go((i+1)%t.length);if(e.key==='ArrowLeft')go((i+t.length-1)%t.length)}})});
var reviewForm=document.getElementById('review-form');
if(reviewForm){
 var reviewList=document.getElementById('review-list');
 var reviewStatus=document.getElementById('review-status');
 var reviewStorageKey='imrana-reviews';
 var reviews=[];
 try{
  var storedReviews=localStorage.getItem(reviewStorageKey);
  var parsedReviews=storedReviews?JSON.parse(storedReviews):[];
  if(Array.isArray(parsedReviews))reviews=parsedReviews.filter(function(review){return review&&typeof review.name==='string'&&typeof review.message==='string'&&Number.isInteger(review.rating)&&review.rating>=1&&review.rating<=5});
 }catch(error){reviews=[]}
 function renderReviews(){
  reviewList.replaceChildren();
  if(!reviews.length){var emptyState=document.createElement('p');emptyState.className='review-empty';emptyState.textContent='No reviews yet. Be the first to share your experience.';reviewList.appendChild(emptyState);return}
  reviews.forEach(function(review){
   var card=document.createElement('article');card.className='review-card';
   var header=document.createElement('div');header.className='review-meta';
   var name=document.createElement('strong');name.textContent=review.name;
   var rating=document.createElement('span');rating.className='review-rating';rating.textContent=review.rating+' out of 5';
   var message=document.createElement('p');message.textContent=review.message;
   header.append(name,rating);card.append(header,message);
   if(review.submittedAt){var date=new Date(review.submittedAt);if(!Number.isNaN(date.getTime())){var dateLabel=document.createElement('time');dateLabel.className='review-date';dateLabel.dateTime=review.submittedAt;dateLabel.textContent=date.toLocaleDateString();card.appendChild(dateLabel)}}
   reviewList.appendChild(card);
  });
 }
 renderReviews();
 reviewForm.addEventListener('submit',function(event){
  event.preventDefault();
  var formValues=new FormData(reviewForm);
  var review={name:String(formValues.get('name')).trim(),rating:Number(formValues.get('rating')),message:String(formValues.get('message')).trim(),submittedAt:new Date().toISOString()};
  if(!review.name||!review.message||!Number.isInteger(review.rating)||review.rating<1||review.rating>5)return;
  reviews.unshift(review);reviews=reviews.slice(0,100);
  try{localStorage.setItem(reviewStorageKey,JSON.stringify(reviews))}
  catch(error){reviews.shift();reviewStatus.textContent='This browser could not save the review. Please try again.';return}
  renderReviews();reviewForm.reset();reviewStatus.textContent='Thank you. Your review has been added in this browser.';
 });
}
// reading progress bar
var pb=document.createElement('div');pb.className='scrollbar';document.body.appendChild(pb);
addEventListener('scroll',function(){pb.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%'},{passive:true});
