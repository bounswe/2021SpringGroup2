from django.test import TestCase
from rest_framework.test import force_authenticate
from rest_framework.test import APITestCase, APIRequestFactory
from rest_framework import status
from equipmentposts.models import EquipmentPost
from authentication.models import User
from equipmentposts.serializers import EquipmentSerializer
from django.urls import reverse
from django.db.models import Q
from datetime import datetime, timedelta


class EquipmentPostSearchTests(APITestCase):
    def setUp(self):
        # create user and get auth token
        self.user = User.objects.create_user(email="user@user.com", password="1234567", username="user")
        resp = self.client.post(reverse('token_create'), {'username': 'user', 'password': '1234567'})
        self.token = resp.data['access']

        # create additional users for spectators and players
        self.user2 = User.objects.create_user(email="user2@user.com", password="1234567", username="user2")
        self.user3 = User.objects.create_user(email="user3@user.com", password="1234567", username="user3")

        # create mock equipments for testing
        self.equipment_01 = EquipmentPost.objects.create(owner=self.user, title='Football for sale',
                                                 content='Selling WC 2010 Jabulani football',
                                                 location='Madrid', sport='Football', equipment_type="ball",
                                                 min_skill_level=3, max_skill_level=4, latitude=40.43103333341609,
                                                 longitude=-3.705507357022727)

        self.equipment_02 = EquipmentPost.objects.create(owner=self.user, title='Basketball shoes for sale',
                                                 content='Selling my Air Jordans',
                                                 location='levent', sport='Basketball', equipment_type="shoes",
                                                 min_skill_level=0, max_skill_level=5, latitude=41.08204996728227,
                                                 longitude=29.016445404346598)

        self.equipment_03 = EquipmentPost.objects.create(owner=self.user, title='NBA ball or something idk',
                                                 content='Selling basketball with NBA logo',
                                                 location='Washington', sport='Basketball', equipment_type="ball",
                                                 min_skill_level=3, max_skill_level=5, latitude=38.90785448747658,
                                                 longitude=-77.04329853399994)

        self.equipment_04 = EquipmentPost.objects.create(owner=self.user, title='Vintage Nike mercurial football cleats',
                                                 content='worn only once',
                                                 location='etiler', sport='Football', equipment_type="shoes",
                                                 min_skill_level=3, max_skill_level=4, latitude=41.13274943188016,
                                                 longitude=29.105688623416825)

        self.basketball_ads = EquipmentSerializer(EquipmentPost.objects.filter(sport="Basketball"), many=True).data

        self.football_ads = EquipmentSerializer(EquipmentPost.objects.filter(sport="Football"), many=True).data

        self.in_turkey_ads = EquipmentSerializer(EquipmentPost.objects.filter(
            Q(location="levent") | Q(location="etiler")), many=True).data

        self.ads_created_by_user = EquipmentSerializer(EquipmentPost.objects.all(), many=True).data
        self.creation_date_today = EquipmentSerializer(EquipmentPost.objects.all(), many=True).data

        self.skill_between_2_4 = self.football_ads

    def test_filter_by_query(self):
        response = self.client.get(reverse('equipmentpost-list'), {'query': 'basketball'}, HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.basketball_ads)

    def test_filter_by_creation_date(self):
        response = self.client.get(reverse('equipmentpost-list'), {'min_creation_date': (datetime.today() - timedelta(3)),
                                                               'max_creation_date': (datetime.today() + timedelta(1))},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.creation_date_today)

    def test_filter_by_location(self):
        response = self.client.get(reverse('equipmentpost-list'), {'location': 'le'},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.in_turkey_ads)

    def test_filter_by_sport(self):
        response = self.client.get(reverse('equipmentpost-list'), {'sport': 'Basketball'},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.basketball_ads)

    def test_filter_by_owner(self):
        response = self.client.get(reverse('equipmentpost-list'), {'owner_id': self.user.id},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.ads_created_by_user)

    def test_filter_by_coordinates(self):
        response = self.client.get(reverse('equipmentpost-list'), {'min_latitude': 36.23763062438484,
                                                               'max_latitude': 42.01901802424485,
                                                               'min_longitude': 26.732105369671633,
                                                               'max_longitude': 44.3513027746188},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.in_turkey_ads)

    def test_filter_by_skill(self):
        response = self.client.get(reverse('equipmentpost-list'), {'min_skill_level': 2, 'max_skill_level': 4},
                                   HTTP_AUTHORIZATION=f'JWT {self.token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], self.skill_between_2_4)

