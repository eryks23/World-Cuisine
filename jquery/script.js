$(function(){
    // toast helper
    function showToast(text, time){
        time = time || 2200;
        var t = $('#toast').text(text).stop(true).fadeIn(180);
        clearTimeout(t.data('timeout'));
        var id = setTimeout(function(){ t.fadeOut(300); }, time);
        t.data('timeout', id);
    }

    // gallery controls
    $('#ukryj').click(() => $('#gallery .card img').fadeOut(400));
    $('#pokaz').click(() => $('#gallery .card img').fadeIn(400));
    $('#ramka').click(() => {
        $('#gallery .card img').css({'border':'6px solid rgba(0,0,0,0.06)','padding':'2px','border-radius':'12px'});
        showToast('Frames added');
    });
    $('#ramka2').click(() => {
        $('#gallery .card img').css({'border':'none','padding':'0'});
        showToast('Frames removed');
    });

    // lightbox toggle
    var lightboxMode = false;
    $('#lightbox').click(function(){
        lightboxMode = !lightboxMode;
        $(this).toggleClass('active');
        showToast(lightboxMode ? 'Lightbox: ON' : 'Lightbox: OFF');
    });

    // open modal with image and comments
    $('#gallery').on('click','img',function(){
        if(!lightboxMode) return;
        var title = $(this).data('title') || $(this).attr('alt') || '';
        $('#modal-title').text(title);
        $('#modal-meta').text($(this).closest('.card').find('small').text());
        $('#modal-body').html('<img src="'+$(this).attr('src')+'" style="width:100%;height:auto;border-radius:10px">');
        renderCommentsFor(title);
        $('#modal').fadeIn(180);
    });

    // close modal
    $('#close-modal,#modal').click(e=>{ if(e.target!==this) return; $('#modal').fadeOut(180); });
    $(document).keydown(e=>{ if(e.key==='Escape') $('#modal').fadeOut(180); });

    // shuffle gallery
    $('#shuffle').click(() => {
        var cards = $('#gallery .card');
        cards.sort(() => 0.5 - Math.random());
        $('#gallery').empty().append(cards);
        showToast('Gallery shuffled');
    });

    // dish list functions
    function addDish(name,country,save){
        if(!name||!country) return;
        var li = $('<li>').text(name+' – '+country);
        var btn = $('<button class="remove" title="Remove">×</button>').click(function(){
            $(this).closest('li').remove();
            showToast('Removed: '+name);
            saveList();
        });
        li.append(' ').append(btn);
        $('#lista-dan').append(li);
        if(save) saveList();
    }

    function saveList(){
        var arr = [];
        $('#lista-dan li').each(function(){ arr.push($(this).text().replace(' ×','').trim()); });
        localStorage.setItem('dania_list',JSON.stringify(arr));
    }

    function loadList(){
        var data = localStorage.getItem('dania_list');
        if(!data) return;
        try{
            var arr = JSON.parse(data);
            $('#lista-dan').empty();
            arr.forEach(item=>{
                var parts = item.split(' – ');
                addDish(parts[0]||item, parts[1]||'', false);
            });
        }catch(e){console.warn('Could not load list');}
    }

    $('#dodaj').click(()=>{
        var n=$('#nazwa').val().trim(), c=$('#kraj').val().trim();
        if(n && c){
            addDish(n,c,true);
            $('#komunikat').text(`Added: ${n} from ${c}`).css('color','green');
            $('#nazwa,#kraj').val('');
        }else{
            $('#komunikat').text('Enter name and country!').css('color','red');
        }
        $('#komunikat').fadeIn(200).delay(1400).fadeOut(600);
    });

    $('#usun').click(()=>{ $('#lista-dan').empty(); saveList(); showToast('All dishes removed'); });

    $('#kolor').click(()=>{
        var color = '#'+Math.floor(Math.random()*16777215).toString(16);
        $('body').animate({opacity:0.2},150,function(){ $(this).css('background',color).animate({opacity:1},180); });
    });

    // contact form
    $('#formularz').submit(function(e){
        e.preventDefault();
        var name = $('#imie').val().trim(), msg = $('#wiadomosc').val().trim(), mail = $('#email').val().trim();
        var ok = $('#zgoda').is(':checked');
        if(!name || !msg || !mail){ $('#potwierdzenie').text('Fill all fields!').css('color','red'); return; }
        if(!ok){ $('#potwierdzenie').text('You must accept terms').css('color','red'); return; }
        var msgs = JSON.parse(localStorage.getItem('messages')||'[]');
        msgs.push({name:name,email:mail,message:msg,date:new Date().toISOString()});
        localStorage.setItem('messages',JSON.stringify(msgs));
        $('#potwierdzenie').text('Thank you!').css('color','green');
        showToast('Message saved (demo)');
        $('#formularz')[0].reset();
        setTimeout(()=>$('#potwierdzenie').fadeOut(800,function(){ $(this).show().css('opacity',1); }),1200);
    });
    $('#clear').click(()=>{ $('#formularz')[0].reset(); $('#potwierdzenie').text(''); });

    // smooth scroll
    $('.nav-link').click(function(e){ e.preventDefault(); $('html,body').animate({scrollTop: $($(this).attr('href')).offset().top - 8},400); });

    loadList();

    // COMMENTS (per image)
    function commentsEnabled(){ return $('#comments-toggle').is(':checked'); }
    function commentsKey(title){ return 'comments_for_'+(title||'unknown').replace(/\s+/g,'_').toLowerCase(); }
    function getComments(title){ return JSON.parse(localStorage.getItem(commentsKey(title))||'[]'); }
    function saveComments(title,arr){ localStorage.setItem(commentsKey(title),JSON.stringify(arr)); }

    function renderCommentsFor(title){
        var $wrap = $('#modal-comments').empty();
        if(!commentsEnabled()){
            $wrap.append('<div style="padding:12px;border-radius:10px;background:#fff9f3;border:1px solid rgba(216,92,63,0.06)">Comments are off — enable "Portfolio comments" to see and add.</div>');
            return;
        }
        var comments = getComments(title), list=$('<div aria-live="polite"></div>');
        if(!comments.length) list.append('<div style="color:var(--muted);margin-bottom:8px">No comments yet — be first!</div>');
        comments.slice().reverse().forEach(c=>{
            var $c=$('<div class="comment">');
            var initials=(c.name||'U').split(' ').map(n=>n.charAt(0).toUpperCase()).slice(0,2).join('');
            $c.append('<div class="avatar">'+initials+'</div>');
            var body=$('<div class="comment-body">');
            body.append('<p class="quote">"'+(c.message||'')+'"</p>');
            body.append('<div class="comment-meta">'+(c.name?c.name+' • ':'')+ (new Date(c.date||'').toLocaleString()) +'</div>');
            $c.append(body);
            list.append($c);
        });
        $wrap.append(list);

        // comment form
        var form=$('<div class="comment-form" role="form" aria-label="Comment form"></div>');
        form.append('<input id="c-name" type="text" placeholder="Your name">');
        form.append('<textarea id="c-text" placeholder="Write a short comment"></textarea>');
        form.append('<div style="display:flex;gap:8px"><button id="c-send">Add comment</button><button id="c-clear" class="ghost">Clear</button></div>');
        $wrap.append(form);

        $('#c-clear').click(()=>$('#c-name,#c-text').val(''));
        $('#c-send').click(()=>{
            var name=$('#c-name').val().trim()||'Anonymous', text=$('#c-text').val().trim();
            if(!text){ showToast('Enter comment'); return; }
            comments.push({name:name,message:text,date:new Date().toISOString()});
            saveComments(title,comments);
            showToast('Comment added');
            renderCommentsFor(title);
        });

        // remove comment (dev alt+click)
        list.on('click','.comment',e=>{ if(e.altKey){ var idx=$(e.currentTarget).index(); comments.splice(comments.length-1-idx,1); saveComments(title,comments); renderCommentsFor(title); showToast('Comment removed'); } });
    }

    if(!localStorage.getItem('portfolio_hint_shown')){
        showToast('Enable "Portfolio comments" so visitors can comment images');
        localStorage.setItem('portfolio_hint_shown','1');
    }
});
