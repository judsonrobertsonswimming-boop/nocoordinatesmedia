(function(){
  var TO='judson@nocoordinatesmedia.com';
  var CDN='https://i.vimeocdn.com/video/';
  try{
    var c=document.createElement('canvas');c.width=c.height=220;
    var x=c.getContext('2d'),d=x.createImageData(220,220);
    for(var i=0;i<d.data.length;i+=4){var v=Math.random()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}
    x.putImageData(d,0,0);
    var g=document.getElementById('grain');if(g)g.style.backgroundImage='url('+c.toDataURL('image/png')+')';
  }catch(e){}

  var external=false;
  var films=[].slice.call(document.querySelectorAll('.film'));
  if(films.length){
    var probe=new Image();
    probe.onload=function(){
      external=true;document.body.classList.add('ext');
      films.forEach(function(f){f.querySelector('img').src=CDN+f.dataset.th+'-d_960';});
    };
    probe.src=CDN+films[0].dataset.th+'-d_295x166';
    var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    films.forEach(function(f){
      var t;
      if(!calm){
        f.addEventListener('mouseenter',function(){t=setTimeout(function(){
          if(!external||f.querySelector('.frame iframe'))return;
          var fr=document.createElement('iframe');fr.src='https://player.vimeo.com/video/'+f.dataset.id+'?background=1&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&dnt=1';
          fr.allow='autoplay';fr.title='';fr.tabIndex=-1;fr.setAttribute('aria-hidden','true');
          f.querySelector('.frame').insertBefore(fr,f.querySelector('.ghost-title'));
        },220)});
        f.addEventListener('mouseleave',function(){clearTimeout(t);var fr=f.querySelector('.frame iframe');if(fr)fr.remove();});
      }
      f.addEventListener('click',function(){
        var id=f.dataset.id,player=document.getElementById('player'),box=document.getElementById('playerBox');
        if(!external||!player){var a=document.createElement('a');a.href='https://vimeo.com/'+id;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();return;}
        box.innerHTML='<iframe src="https://player.vimeo.com/video/'+id+'?autoplay=1&title=0&byline=0&portrait=0&dnt=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Film"></iframe>';
        player.classList.add('on');document.getElementById('closePlayer').focus();
      });
    });
  }
  var player=document.getElementById('player');
  if(player){
    var box=document.getElementById('playerBox');
    var close=function(){player.classList.remove('on');box.innerHTML='';};
    document.getElementById('closePlayer').addEventListener('click',close);
    player.addEventListener('click',function(e){if(e.target===player)close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  }

  function send(subject,pairs){
    var f=document.createElement('form');f.method='POST';f.action='https://formsubmit.co/'+TO;f.style.display='none';
    var all=pairs.concat([['Page',location.pathname],['_subject',subject],['_template','table'],['_next','https://nocoordinatesmedia.com/thanks'],
      ['_autoresponse','Thanks for reaching out to No Coordinates Media. We have your request and will reply with a price and shoot plan within one business day. Need us sooner? WhatsApp or WeChat: +1 954 405 2460.'],['_honey','']]);
    all.forEach(function(p){var i=document.createElement('input');i.type='hidden';i.name=p[0];i.value=p[1];f.appendChild(i)});
    document.body.appendChild(f);f.submit();
  }
  function esc(s){return String(s).replace(/[&<>"]/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]})}
  [].forEach.call(document.querySelectorAll('form[data-lead]'),function(form){
    var out=form.parentNode.querySelector('.result');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var missing=[];
      [].forEach.call(form.querySelectorAll('[required]'),function(el){if(!el.value.trim())missing.push(el)});
      if(missing.length){missing[0].focus();out.className='result on';out.textContent='Fill in the highlighted field and try again.';missing[0].style.borderColor='var(--tally)';return;}
      var pairs=[];
      [].forEach.call(form.querySelectorAll('[name]'),function(el){pairs.push([el.name==='email'?'email':el.dataset.label,el.value||'not given'])});
      out.className='result on';out.textContent='Sending your request...';
      var brand=form.querySelector('[name=brand]');
      send(form.dataset.lead+(brand&&brand.value?': '+brand.value:''),pairs);
    });
  });
})();
