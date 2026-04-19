import pytest

from base_classes import Game
from cards import Hamster_lion, Luchataur, Tiger_squirrel, Wolfman_steve
from enums import CardSet, GameState


def _new_game() -> Game:
    game = Game(
        player_names=["Player 1", "Player 2"],
        starting_draw_pile_size=0,
    )
    game.start_game()
    return game


def test_initial_game_state_is_start_turn_before_start_game() -> None:
    game = Game(
        player_names=["Player 1", "Player 2"],
        starting_draw_pile_size=0,
    )

    assert game.game_state == GameState.START_TURN
    assert game.winner is None


def test_start_game_sets_state_to_active_and_resets_winner() -> None:
    game = Game(
        player_names=["Player 1", "Player 2"],
        starting_draw_pile_size=0,
    )
    game.winner = game.players[0]

    game.start_game()

    assert game.game_state == GameState.ACTIVE
    assert game.turn in (0, 1)
    assert game.current_player in game.players
    assert game.winner is None


def test_end_turn_switches_player_and_sets_start_turn_state() -> None:
    game = _new_game()
    first_player = game.current_player
    next_player = game.opponent
    next_player.hand = [Tiger_squirrel()]

    game.end_turn()

    assert game.game_state == GameState.START_TURN
    assert game.current_player is not first_player


def test_attack_that_reduces_opponent_to_zero_life_sets_game_over_and_winner() -> None:
    game = _new_game()
    player = game.current_player
    opponent = game.opponent

    player.cards_laid_out = [Luchataur()]
    opponent.number_of_lives = 1

    game.attack(attacker_index=0, defender_index=None)

    assert opponent.number_of_lives == 0
    assert game.game_state == GameState.GAME_OVER
    assert game.winner is player


def test_actions_raise_error_after_game_is_over() -> None:
    game = _new_game()
    player = game.current_player
    opponent = game.opponent

    player.cards_laid_out = [Luchataur()]
    opponent.number_of_lives = 1
    game.attack(attacker_index=0, defender_index=None)

    with pytest.raises(ValueError, match="Game is already over."):
        game.end_turn()

    with pytest.raises(ValueError, match="Game is already over."):
        game.play_card(hand_index=0, card=Tiger_squirrel())


def test_start_game_uses_only_selected_card_sets() -> None:
    game = Game(
        player_names=["Player 1", "Player 2"],
        starting_draw_pile_size=10,
    )

    game.start_game(sets=[CardSet.FIRST_CONTACT])

    assert game.selected_sets == [CardSet.FIRST_CONTACT]

    for player in game.players:
        assert all(card.set == CardSet.FIRST_CONTACT for card in player.hand)
        assert all(card.set == CardSet.FIRST_CONTACT for card in player.draw_pile.cards)


def test_start_game_stores_all_available_sets_when_no_filter_is_passed() -> None:
    game = Game(
        player_names=["Player 1", "Player 2"],
        starting_draw_pile_size=0,
    )

    game.start_game()

    assert game.selected_sets == [
        CardSet.FIRST_CONTACT,
        CardSet.NEW_SERVANTS,
        CardSet.PROMO_CARDS,
    ]


def test_player_loses_when_no_playable_hand_card_and_no_attackable_creature() -> None:
    game = _new_game()
    next_player = game.opponent
    # Hand contains only a weak card that Wolfman Steve forbids,
    # board contains only a creature that Hamster Lion locks down.
    next_player.hand = [Tiger_squirrel()]
    next_player.cards_laid_out = [Tiger_squirrel()]
    game.current_player.cards_laid_out = [Wolfman_steve(), Hamster_lion()]

    expected_winner = game.current_player

    game.end_turn()

    assert game.game_state == GameState.GAME_OVER
    assert game.winner is expected_winner


def test_player_does_not_lose_when_at_least_one_hand_card_is_playable() -> None:
    game = _new_game()
    next_player = game.opponent
    # Wolfman Steve forbids power<=4 plays; Luchataur (9) is still playable.
    next_player.hand = [Tiger_squirrel(), Luchataur()]
    game.current_player.cards_laid_out = [Wolfman_steve()]

    game.end_turn()

    assert game.game_state == GameState.START_TURN
    assert game.winner is None


def test_player_does_not_lose_when_at_least_one_creature_can_attack() -> None:
    game = _new_game()
    next_player = game.opponent
    # All hand cards forbidden, but a free creature on board can attack.
    next_player.hand = [Tiger_squirrel()]
    next_player.cards_laid_out = [Luchataur()]
    game.current_player.cards_laid_out = [Wolfman_steve()]

    game.end_turn()

    assert game.game_state == GameState.START_TURN
    assert game.winner is None
