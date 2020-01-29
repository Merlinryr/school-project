let originBoard;
const joueur = 'o'; // Variable joueur
const robot = 'x'; // Variable robot

const cells = $('.cell'); // Sélecteur des cellules du tableau


// Ensemble des possibilité de victoire par combinaisons
const winCombos = [
  // Combinaisons horizontales
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Combinaisons verticales
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Combinaisons diagonales
  [0, 4, 8],
  [2, 4, 6]
];

// Appelle la fonction play
Play();

// Fonction de démarrage de l'instance 'jeu'
function Play() {
  // Efface le popup de résultat lors du restart
  $('.end-game').css("display", "none");
  // Attribue les cases du tableau HTML à la variable Plateau de jeu
  originBoard = Array.from(Array(9).keys());
  // console.table(originBoard, cells);

  // Pour chaque cases du tableau
  for (let i = 0; i < cells.length; i++) {
    // Règle le texte sur null
    cells[i].innerText = '';
    // Supprime le background color CSS
    cells[i].style.removeProperty('background-color');
    // Ecouteur d'évènement: lors du click, lance la fonction onTurnClick
    cells[i].addEventListener('click', onTurnClick, false)
  }

  console.clear();
};


// Fonction d'instance lors du clic
function onTurnClick(e) {
  // Affiche le numéro de la case cliquée
  console.log(e.target.id);

  // Attribue un ID à cette case
  const {
    id: squareId
  } = e.target;

  // Si le type de valeur de la case est un nombre
  if (typeof originBoard[squareId] === 'number') {
    // Appelle la fonction onTurn joueur
    onTurn(squareId, joueur);
    // Si 
    if (!onCheckGameTie()) {
      // Appelle la fonction onTurn robot
      onTurn(botPicksSpot(), robot)
    }
  } else {
    // Affiche un message d'erreur en cas de clic d'une case déjà remplie
    const message = 'Cette case a déjà été cliquée, veuillez en choisir une autre';
    alert(message);
  }
}

// Gestion du tour
function onTurn(squareId, player) {
  originBoard[squareId] = player; // Attribue le signe du joueur au numéro de la case occupée (Croix ou Rond)

  $('#'+squareId).fadeOut(function(){
    $(this).text(player);
  }).fadeIn(); // Affiche le signe du joueur dans la case via CSS
  let isGameWon = onCheckWin(originBoard, player); // Vérifie le cas victoire
  // console.log(isGameWon)

  
  // Si victoire
  if (isGameWon) {
    // Déclenche la fin du jeu
    onGameOver(isGameWon);
  }
}


// Fonction de vérification de victoire
function onCheckWin(board, player) {
  // Variable plays stockant la somme de chaque case
  let plays = board.reduce((a, e, i) => {
    return (e === player) ? a.concat(i) : a; // Si le paramètre 'e' est égal à player, le paramètre i est mis en bout de paramètre a (concatenation), sinon, ne garder que "a"
  }, []);
  // Stocke la victoire dans une variable (réglée sur false donc défaite) 
  let gameWon = false;
  // Pour chaque case du tableau winCombos (Chaque valeur composée de l'index dans le tableau et de la valeur)
  for (let [index, win] of winCombos.entries()) {
    // Si chaque case d'une même combinaison sont cochées (méthode every vérifiant une condition pour tous les éléments)
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      // Attribue la combinaison au joueur
      gameWon = {
        index: index,
        player: player
      };
      break;
    }
  }
  // Déclare la victoire
  return gameWon;
}


// Fonction déclarée à la fin de la partie (paramètre tableau de chaque case)
function onGameOver({
  index,
  player
}) {
  // Pour chaque combinaisons dans win Combos
  for (let i of winCombos[index]) {
    // Si id du joueur est égal au joueur humain colorie en bleu sinon rouge
    const color = (player === joueur) ? '#4ef542' : '#f44336';
    // Règle la propriété CSS pour chaque éléments
    document.getElementById(i).style.backgroundColor = color;
  }
  // Pour chaque cases
  for (let i = 0; i < cells.length; i++) {
    // Supprime l'évènement de clique pour bloquer le jeu
    cells[i].removeEventListener('click', onTurnClick, false)
  }

  // Affiche le résultat: si le gagnant est humain alors afficher victoire, sinon défaite
  const result = (player === joueur) ? "C'est gagné !" : "C'est perdu !";
  // Fonction d'affichage des résultats
  onDeclareWinner(result);
}


// Affichage des résultats finaux
function onDeclareWinner(who) {
  // Règle le texte de la balise end game
  document.querySelector('.end-game').style.display = 'block';
  document.querySelector('.end-game .text').innerText = `Résultat: ${who}`;
}


// Fonction de vérification d'égalité
function onCheckGameTie() {
  // Si il n'y a plus aucune case vide
  if (emptySquares().length === 0) {
    // Pour chaque case, colorie en vert puis supprime l'écouteur d'évènement pour bloquer le jeu
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = '#fcba03';
      cells[i].removeEventListener('click', onTurnClick, false)
    }
    // Lance la fonction de résultat
    onDeclareWinner('Il y a égalité');
    return true;
  } else {
    return false;
  }
}


// Renvoie le nombre de cases vides (renvoie les items où le type de valeur est nombre)
function emptySquares() {
  return originBoard.filter(item => typeof item === 'number');
}

// Fonction de décision du robot
function botPicksSpot() {
  return minimax(originBoard, robot).index;
}



///////////////////////////////////////////////////////////////////////////////////
//                             ALGORITHME ROBOT                                 //
//////////////////////////////////////////////////////////////////////////////////


// Algorithme min max de décision de l'intelligence artificielle
function minimax(newBoard, player) {
  // Référence les cases libres grâce à la fonction de vérification
  let availableSpots = emptySquares();

  // Si joueur humain gagne la partie, règle le score min robot à -10
  if (onCheckWin(newBoard, joueur)) {
    return {
      score: -10
    }
  } 
  // Si joueur robot gagne la partie, règle le score max robot à +10
  else if (onCheckWin(newBoard, robot)) {
    return {
      score: 10
    }
  } 
  // Si égalité, règle le score robot à 0
  else if (availableSpots.length === 0) {
    return {
      score: 0
    }
  }

  // Référence les coups du robot
  let moves = [];

  // Pour chaque case libre
  for (let i = 0; i < availableSpots.length; i++) {
    // Stocke ces cases dans le tableau des coups robot
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player === robot) {
      let result = minimax(newBoard, joueur);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, robot);
      move.score = result.score;
    } // Fin du bloc de condition

    // Rafraîchi la vérification des cases libres
    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  }

  // Détermine le meilleur coup
  let bestMove;

  // Si le joueur actuel est robot
  if (player === robot) {
    // Défini le meilleur score sur -10000;
    let bestScore = -10000;
    // Pour chaque coups potentiels
    for (let i = 0; i < moves.length; i++) {
      // Si le score des coups est supérieur au meilleur score
      if (moves[i].score > bestScore) {
        // Le meilleur score est défini sur le score du dernier élément
        bestScore = moves[i].score;
        // Donne un numéro au meilleur coup
        bestMove = i;
      }
    }
  } 
  // Sinon, définir le meilleur score sur +10000
  else {
    let bestScore = 10000;
    // Pour chaque coups potentiels
    for (let i = 0; i < moves.length; i++) {
      // Si le score des coups est inférieur au meilleur score
      if (moves[i].score < bestScore) {
        // Le meilleur score est défini sur le score du dernier élément
        bestScore = moves[i].score;
        // Donne un numéro au meilleur coup
        bestMove = i;
      }
    }
  }
  // Renvoie le numéro de la case représentant le meilleur coup potentiel
  return moves[bestMove];
}