from django.test import TestCase
from rest_framework.test import force_authenticate
from rest_framework.test import APITestCase, APIRequestFactory
from rest_framework import status
from eventposts.models import EventPost
from authentication.models import User
from eventposts.serializers import EventSerializer
from django.urls import reverse
from django.db.models import Q
from datetime import datetime, timedelta


class EventPostSearchTests(APITestCase):
    def setUp(self):
        # create user and get auth token
        self.user = User.objects.create_user(email="user@user.com", password="1234567", username="user")
        resp = self.client.post(reverse('token_create'), {'username': 'user', 'password': '1234567'})
        self.token = resp.data['access']

        # create additional users for spectators and players
        self.user2 = User.objects.create_user(email="user2@user.com", password="1234567", username="user2")
        self.user3 = User.objects.create_user(email="user3@user.com", password="1234567", username="user3")

        # create mock events for testing
        self.event_01 = EventPost.objects.create(owner=self.user, title='Football Event',
                                                 content='We are organizing a football match with FC Barcelona fans.',
                                                 location='Madrid', date=datetime(2021, 9, 3), sport='Football',
                                                 min_age=13, max_age=45, player_capacity=14, spec_capacity=20,
                                                 min_skill_level=3, max_skill_level=4, latitude=40.43103333341609,
                                                 longitude=-3.705507357022727, duration=90, players=[self.user.id],
                                                 spectators=[self.user2.id, self.user3.id])

        self.event_02 = EventPost.objects.create(owner=self.user, title='basketball event',
                                                 content='We are organizing a basketball match with Anadolu Efes fans.',
                                                 location='levent', date=datetime(2022, 5, 5), sport='Basketball',
                                                 min_age=20, max_age=33, player_capacity=6, spec_capacity=10,
                                                 min_skill_level=0, max_skill_level=5, latitude=41.08204996728227,
                                                 longitude=29.016445404346598, duration=120,
                                                 spectators=[self.user.id, self.user2.id, self.user3.id])

        self.event_03 = EventPost.objects.create(owner=self.user, title="Let's show some NBA skillz",
                                                 content='Guys, today we are gathering to play basketball, join us!',
                                                 location='Washington', date=datetime(2022, 4, 4), sport='Basketball',
                                                 min_age=18, max_age=30, player_capacity=8, spec_capacity=10,
                                                 min_skill_level=3, max_skill_level=5, latitude=38.90785448747658,
                                                 longitude=-77.04329853399994, duration=120)

        self.event_04 = EventPost.objects.create(owner=self.user, title="Tek kale aylık",
                                                 content='hep maç olmaz bu sefer tek kale aylık ayarlıyoruz,'
                                                         ' katılım sınırlıdır',
                                                 location='etiler', date=datetime(2021, 1, 13), sport='Football',
                                                 min_age=13, max_age=17, player_capacity=5, spec_capacity=18,
                                                 min_skill_level=3, max_skill_level=4, latitude=41.13274943188016,
                                                 longitude=29.105688623416825, duration=60,
                                                 players=[self.user.id, self.user2.id], spectators=[self.user3.id])

        self.basketball_games = EventSerializer(EventPost.objects.filter(sport="Basketball"), many=True).data

        self.football_games = EventSerializer(EventPost.objects.filter(sport="Football"), many=True).data

        self.player_capacity_between_6_10_games = EventSerializer(
            EventPost.objects.filter(Q(player_capacity=6) | Q(player_capacity=8)), many=True).data

        self.spec_capacity_between_15_25_games = self.football_games

        self.age_between_18_35_games = self.basketball_games

        self.in_turkey_games = EventSerializer(EventPost.objects.filter(
            Q(location="levent") | Q(location="etiler")), many=True).data

        self.date_inside_2022_games = self.basketball_games

        self.duration_between_45_100_games = self.football_games
        self.games_created_by_user = EventSerializer(EventPost.objects.all(), many=True).data
        self.creation_date_today = EventSerializer(EventPost.objects.all(), many=True).data
        self.num_players_between_1_5_games = self.football_games
        self.num_spectators_between_3_5_games = EventSerializer(EventPost.objects.filter(title="basketball event"),
                                                          many=True).data

        self.skill_between_2_4 = self.football_games

    def test_filter_by_query(self):
        response = self.client.get(reverse('eventpost-list'), {'query': 'basketball'}, HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.basketball_games)

    def test_filter_by_date(self):
        response = self.client.get(reverse('eventpost-list'), {'min_date': datetime(2021, 12, 12),
                                                               'max_date': datetime(2023, 1, 1)},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.date_inside_2022_games)

    def test_filter_by_creation_date(self):
        response = self.client.get(reverse('eventpost-list'), {'min_creation_date': (datetime.today() - timedelta(3)),
                                                               'max_creation_date': (datetime.today() + timedelta(1))},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.creation_date_today)

    def test_filter_by_player_capacity(self):
        response = self.client.get(reverse('eventpost-list'), {'min_player_capacity': 6, 'max_player_capacity': 10},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.player_capacity_between_6_10_games)

    def test_filter_by_spec_capacity(self):
        response = self.client.get(reverse('eventpost-list'), {'min_spectator_capacity': 15, 'max_spectator_capacity': 25},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.spec_capacity_between_15_25_games)

    def test_filter_by_location(self):
        response = self.client.get(reverse('eventpost-list'), {'location': 'le'},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.in_turkey_games)

    def test_filter_by_duration(self):
        response = self.client.get(reverse('eventpost-list'), {'min_duration': 45, 'max_duration': 100},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.duration_between_45_100_games)

    def test_filter_by_sport(self):
        response = self.client.get(reverse('eventpost-list'), {'sport': 'Basketball'},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.basketball_games)

    def test_filter_by_owner(self):
        response = self.client.get(reverse('eventpost-list'), {'owner_id': self.user.id},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.games_created_by_user)

    def test_filter_by_age(self):
        response = self.client.get(reverse('eventpost-list'), {'min_age': 18, 'max_age': 35},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.age_between_18_35_games)

    def test_filter_by_coordinates(self):
        response = self.client.get(reverse('eventpost-list'), {'min_latitude': 36.23763062438484,
                                                               'max_latitude': 42.01901802424485,
                                                               'min_longitude': 26.732105369671633,
                                                               'max_longitude': 44.3513027746188},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.in_turkey_games)

    def test_filter_by_player_numbers(self):
        response = self.client.get(reverse('eventpost-list'), {'min_players': 1, 'max_players': 5},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.num_players_between_1_5_games)

    def test_filter_by_spectator_numbers(self):
        response = self.client.get(reverse('eventpost-list'), {'min_spectators': 3, 'max_spectators': 5},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.num_spectators_between_3_5_games)

    def test_filter_by_skill(self):
        response = self.client.get(reverse('eventpost-list'), {'min_skill_level': 2, 'max_skill_level': 4},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.skill_between_2_4)


class EventPostApplicationTests(APITestCase):
    def setUp(self):
        # create user and get auth token
        self.user = User.objects.create_user(email="user@user.com", password="1234567", username="user",
                                             birthday=datetime.now().date() - timedelta(days=25*365))
        resp = self.client.post(reverse('token_create'), {'username': 'user', 'password': '1234567'})
        self.token = resp.data['access']

        # create additional users for spectators and players
        self.user2 = User.objects.create_user(email="user2@user.com", password="1234567", username="user2")
        self.user3 = User.objects.create_user(email="user3@user.com", password="1234567", username="user3")
        self.user4 = User.objects.create_user(email="user4@user.com", password="1234567", username="user4")

        # create mock events for testing
        self.event_01 = EventPost.objects.create(owner=self.user, title='Football Event',
                                                 content='We are organizing a football match with FC Barcelona fans.',
                                                 location='Madrid', date=datetime(2021, 9, 3), sport='Football',
                                                 min_age=13, max_age=45, player_capacity=14, spec_capacity=20,
                                                 min_skill_level=3, max_skill_level=4, latitude=40.43103333341609,
                                                 longitude=-3.705507357022727, duration=90)

        self.event_02 = EventPost.objects.create(owner=self.user, title='Basketball Event',
                                                 content='We are organizing a basketball match with Anadolu Efes fans.',
                                                 location='Madrid', date=datetime(2021, 9, 3), sport='Football',
                                                 min_age=13, max_age=45, player_capacity=1, spec_capacity=10,
                                                 min_skill_level=3, max_skill_level=4, latitude=40.43103333341609,
                                                 longitude=-3.705507357022727, duration=90, players=[self.user2.id],
                                                 spectators=[self.user3.id])

        self.event_03 = EventPost.objects.create(owner=self.user, title='Basketball Event for Real Madrid',
                                                 content='We are organizing a basketball match with Real Madrid fans.',
                                                 location='Madrid', date=datetime(2021, 9, 3), sport='Football',
                                                 min_age=13, max_age=45, player_capacity=10, spec_capacity=1,
                                                 min_skill_level=3, max_skill_level=4, latitude=40.43103333341609,
                                                 longitude=-3.705507357022727, duration=90, players=[self.user2.id],
                                                 spectators=[self.user3.id])

        self.event_04 = EventPost.objects.create(owner=self.user, title='Football Match FB vs GS',
                                                 content='All fans are invited, no fight just game',
                                                 location='Madrid', date=datetime(2021, 9, 3), sport='Football',
                                                 min_age=13, max_age=17, player_capacity=10, spec_capacity=10,
                                                 min_skill_level=3, max_skill_level=4, latitude=40.43103333341609,
                                                 longitude=-3.705507357022727, duration=90,
                                                 spec_applicants=[self.user2.id, self.user3.id],
                                                 player_applicants=[self.user4.id])

        self.event_05 = EventPost.objects.create(owner=self.user, title='Football Match FB vs GS',
                                                 content='All fans are invited, no fight just game',
                                                 location='Madrid', date=datetime(2021, 9, 3), sport='Football',
                                                 min_age=13, max_age=17, player_capacity=1, spec_capacity=1,
                                                 min_skill_level=3, max_skill_level=4, latitude=40.43103333341609,
                                                 longitude=-3.705507357022727, duration=90,
                                                 spec_applicants=[self.user2.id],
                                                 player_applicants=[self.user4.id],
                                                 players=[self.user.id], spectators=[self.user3.id])

    def test_apply_as_spectator(self):
        response = self.client.post(reverse('eventpost-apply', args=[str(self.event_01.id)]),
                                    {'type': 'spectator', 'user': self.user.id}, HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary'], f"{str(self.user.id)} applied to event {str(self.event_01.id)} as spectator")
        self.assertEqual(response.data['type'], 'Join')

    def test_apply_as_player(self):
        response = self.client.post(reverse('eventpost-apply', args=[str(self.event_01.id)]),
                                    {'type': 'player', 'user': self.user.id},
                                    HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary'],
                         f"{str(self.user.id)} applied to event {str(self.event_01.id)} as player")
        self.assertEqual(response.data['type'], 'Join')

    def test_apply_as_player_at_full_capacity(self):
        response = self.client.post(reverse('eventpost-apply', args=[str(self.event_02.id)]),
                                    {'type': 'player', 'user': self.user.id},
                                    HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['detail'], "the event has reached its capacity for players.")

    def test_apply_as_spectator_at_full_capacity(self):
        response = self.client.post(reverse('eventpost-apply', args=[str(self.event_03.id)]),
                                    {'type': 'spectator', 'user': self.user.id},
                                    HTTP_AUTHORIZATION=f'JWT {self.token}')

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['detail'], "the event has reached its capacity for spectators.")

    def test_apply_as_player_when_not_qualified(self):
        response = self.client.post(reverse('eventpost-apply', args=[str(self.event_04.id)]),
                                    {'type': 'player', 'user': self.user.id},
                                    HTTP_AUTHORIZATION=f'JWT {self.token}')

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['detail'], "Applicant age is not appropriate for this event.")

    def test_accept_applicant_as_player(self):
        response = self.client.post(reverse('eventpost-applicants', args=[str(self.event_04.id)]),
                                    {'type': 'player', 'user': self.user4.id, 'owner': self.user.id, 'accept': True},
                                    HTTP_AUTHORIZATION=f'JWT {self.token}')

        # fetch the updated object
        self.event_04 = EventPost.objects.get(id=self.event_04.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary'], f"{str(self.event_04.owner.id)} accepted {self.user4.id} to "
                                                   f"event {self.event_04.id} as player")
        self.assertEqual(response.data['type'], 'Accept')
        self.assertEqual(self.event_04.player_applicants, [])
        self.assertIn(self.user4.id, self.event_04.players)

    def test_accept_applicant_as_spectator(self):
        response = self.client.post(reverse('eventpost-applicants', args=[str(self.event_04.id)]),
                                    {'type': 'spectator', 'user': self.user2.id, 'owner': self.user.id, 'accept': True},
                                    HTTP_AUTHORIZATION=f'JWT {self.token}')

        # fetch the updated object
        self.event_04 = EventPost.objects.get(id=self.event_04.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary'], f"{str(self.event_04.owner.id)} accepted {self.user2.id} to "
                                                   f"event {self.event_04.id} as spectator")
        self.assertEqual(response.data['type'], 'Accept')
        self.assertEqual(self.event_04.spec_applicants, [self.user3.id])
        self.assertIn(self.user2.id, self.event_04.spectators)

    def test_accept_applicant_as_player_at_full_capacity(self):
        response = self.client.post(reverse('eventpost-applicants', args=[str(self.event_05.id)]),
                                    {'type': 'player', 'user': self.user4.id, 'owner': self.user.id, 'accept': True},
                                    HTTP_AUTHORIZATION=f'JWT {self.token}')

        # fetch the updated object
        self.event_05 = EventPost.objects.get(id=self.event_05.id)

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['detail'], "the event has reached its capacity for players.")
        self.assertIn(self.user4.id, self.event_05.player_applicants)
        self.assertNotIn(self.user4.id, self.event_05.players)

    def test_accept_applicant_as_spectator_at_full_capacity(self):
        response = self.client.post(reverse('eventpost-applicants', args=[str(self.event_05.id)]),
                                    {'type': 'spectator', 'user': self.user2.id, 'owner': self.user.id, 'accept': True},
                                    HTTP_AUTHORIZATION=f'JWT {self.token}')
        # fetch the updated object
        self.event_05 = EventPost.objects.get(id=self.event_05.id)

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['detail'], "the event has reached its capacity for spectators.")
        self.assertIn(self.user2.id, self.event_05.spec_applicants)
        self.assertNotIn(self.user2.id, self.event_05.spectators)

    def test_reject_applicant_as_spectator(self):
        response = self.client.post(reverse('eventpost-applicants', args=[str(self.event_04.id)]),
                                    {'type': 'spectator', 'user': self.user2.id, 'owner': self.user.id, 'accept': False},
                                    HTTP_AUTHORIZATION=f'JWT {self.token}')

        # fetch the updated object
        self.event_04 = EventPost.objects.get(id=self.event_04.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary'], f"{str(self.event_04.owner.id)} rejected {self.user2.id} from "
                                                   f"event {self.event_04.id} as spectator")
        self.assertEqual(response.data['type'], 'Reject')
        self.assertEqual(self.event_04.spec_applicants, [self.user3.id])
        self.assertNotIn(self.user2.id, self.event_04.players)

    def test_reject_applicant_as_player(self):
        response = self.client.post(reverse('eventpost-applicants', args=[str(self.event_04.id)]),
                                    {'type': 'player', 'user': self.user4.id, 'owner': self.user.id, 'accept': False},
                                    HTTP_AUTHORIZATION=f'JWT {self.token}')

        # fetch the updated object
        self.event_04 = EventPost.objects.get(id=self.event_04.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary'], f"{str(self.event_04.owner.id)} rejected {self.user4.id} from "
                                                   f"event {self.event_04.id} as player")
        self.assertEqual(response.data['type'], 'Reject')
        self.assertEqual(self.event_04.player_applicants, [])
        self.assertNotIn(self.user4.id, self.event_04.players)

    def test_get_spec_applicants(self):
        response = self.client.get(reverse('eventpost-applicants', args=[str(self.event_04.id)]), {'type': 'spectator'},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['applicants'], self.event_04.spec_applicants)

    def test_get_player_applicants(self):
        response = self.client.get(reverse('eventpost-applicants', args=[str(self.event_04.id)]), {'type': 'player'},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['applicants'], self.event_04.player_applicants)
