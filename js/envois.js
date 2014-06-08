// animation de la validation du formulaire
function faux(objet, texte) {
    objet.animate({
        borderColor: '#ff0000',
        'border-width': '4px'
    },200);
    if (texte) {
        alert(texte);
    }
    objet.focus();
    return false;
};

function vrai(objet) {
    objet.css({
        borderWidth: '1',
        borderColor: '#000'
    });
};

/*
*  routines de vérification des formulaires
*/
function checkLength(o, min, max, texte) {
    if (o.val().length > max || o.val().length < min) {
        faux(o, texte);
        o.focus();
        return false;
    } else {
        vrai(o);
        return true;
    }
};

function checkRegexp(o, regexp, texte) {
    if (! (regexp.test(o.val()))) {
        faux(o, texte);
        o.focus();
        return false;
    } else {
        vrai(o);
        return true;
    }
};

// verification du formulaire
function verif(objet) {
    var valid = true;
    valid = valid && checkLength($('input[name="nom"]'), 3, 50, "Le nom est obligatoire");
    valid = valid && checkRegexp($('input[name="telephone"]'), /[0-9]{10}/, "Le téléphone est obligatoire");
    valid = valid && checkRegexp($('input[name="email"]'), /^([a-z0-9_-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+)(\.[a-z0-9_-]+)*[\.]([a-z0-9_-]+)$/i, "L'adresse mail fournie n'est pas valide");
    valid = valid && checkLength($('textarea[name="message"]'), 1, 1000, "Vous devez laisser un message");
    if (valid) {
        return true;
    }
    else {
        return false;
    };
};

// fonction ne s'exécutant qu'à la fin du chargement de la page
$(function() {
    
    // animation au focus d'un champ
    $('.inputxt, .inputnum, .inputarea').focus(function() {
        $(this).parent().animate({
            backgroundColor: '#FFCB7E',
            padding: '20px'
        },
        {
            duration: 600,
            'easing': 'easeOutCubic'
        });
    });
    $('.inputxt, .inputnum, .inputarea').blur(function() {
        $(this).parent().animate({
            backgroundColor: '#fde2a7',
            padding: '0'
        },
        {
            duration: 600,
            'easing': 'easeOutCubic'
        });
    });

    // gestion de la soumission du formulaire
    $('#valid_btn').click(function() {
        // vérification du formulaire
        var test = verif($('#fcontact'));
        // si le formulaire est bien repli, alors on envois les données
        if (test) {
            // mise en place de l'animation d'attente
            $('#log p#rien').remove();
            // insertion d'un paragraphe à la fin du div#log
            $("<p id='attente'>Traitement <img src='images/attente.gif'/></p>").hide().appendTo('#log').fadeIn('fast');
            // appel "ajax" de envois.php
            $.post(
                "envois.php", // adresse du script coté serveur
                $('#fcontact').serialize(), // sérialisation des données du formulaire
                function(data) { // fonction s'exécutant lors du retour d'info du script coté serveur
                    // on retire l'animation d'attente
                    $('#log p#attente').remove();
                    // et à la place on insère le résultat en douceur...
                    $("<div id='retour>" + data + "</div").hide().appendTo('#log').fadeIn();
                }
            );
        };
    });
});