![Game Votes icon](https://jasongardner.co/game-votes/readme.png "Game Votes")

# Game Votes

My girlfriend's kids *always* fight over which video game we're going to play.
I created a simple app to resolve these disputes.

https://jasongardner.co/game-votes/

A game is chosen at random from a list of nominated games. Mario Kart 8's online
multiplayer track selection inspired me.

This is my first Vue.js project! I'd love some [feedback](#feedback).

## How To

1. Everyone starts with one vote.
	- Votes can be added by pressing the *coin* icon.
2. Place your vote by tapping on the game cover.
	- A series of dots are displayed next to the game title to indicate the number 
	of votes it has received.
	- The number of remaining votes is displayed at the top.
	- Pressing the *reset* icon removes the current votes and reverts the number
	of remaining votes to its default value.
3. Press the *checkmark* icon to select one of the nominated games __at random__.
	- __The number of votes a game receives increases the odds it will be chosen,__
	but does not guarantee the most popular choice will be selected. (e.g. 2000 & 2016)
	- You can make a game selection without placing all of the allotted votes.
4. Review the results.
	- The randomly selected game is displayed along with a list of nominated
	games and the number of votes each received.
5. Press "Pick Again" or "Start Over" for new results.
	- Pressing "Pick Again" will remove the currently selected game from the
	list of candidates before making another random selection.

## Feedback

This is my very first Vue.js project. Tell me how I did! Did I nail it, or have
I used Vue.js in an unconventional, dimwitted way?

(Since this is a personal project, I'm not overly concerned about browser
compatibility, accessibility issues, SEO, etc.) 

Please leave your feedback [in the repository's Issues](https://github.com/jasonjgardner/vue-game-vote/issues/1).

## License
__MIT__

Feel free to use this app's logic to create your own sorta-democratic process,
or reuse the CSS in your own Nintendo Switch-styled UI. 

### Attribution

Audio provided by [The Mushroom Kingdom](https://themushroomkingdom.net/media/smb/wav).
