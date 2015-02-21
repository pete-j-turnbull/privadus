from tastypie.resources import ModelResource
from tastypie.http import HttpUnauthorized, HttpForbidden
from tastypie import fields
from tastypie.authorization import Authorization
from models import Profile, Campaign, Agent, AnonymousProfile, Demographic, Advert, PhoneUser
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.conf.urls import url
from django.conf import settings
from home.services import MediaManager, WalletManager
import os
import re


class UserResource(ModelResource):
    wallet_manager = WalletManager()

    class Meta:
        queryset = get_user_model().objects.all()
        fields = ['email']
        resource_name = 'user'
        allowed_methods = ['post', 'get']

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/login$" %
                self._meta.resource_name,
                self.wrap_view('login'), name="api_login"),
            url(r'^(?P<resource_name>%s)/logout$' %
                self._meta.resource_name,
                self.wrap_view('logout'), name='api_logout'),
            url(r'^(?P<resource_name>%s)/signup$' %
                self._meta.resource_name,
                self.wrap_view('signup'), name='api_signup'),
        ]

    def login(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))

        email = data.get('email', '')
        password = data.get('password', '')

        user = authenticate(email=email, password=password)
        if user:
            login(request, user)
            return self.create_response(request, {
                'success': True
            })
        else:
            return self.create_response(request, {
                'success': False,
                'reason': 'incorrect',
                }, HttpUnauthorized)

    def logout(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        if request.user and request.user.is_authenticated():
            logout(request)
            return self.create_response(request, {'success': True})
        else:
            return self.create_response(request, {'success': False}, HttpUnauthorized)

    def signup(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))

        name = data.get('name', '')
        organisation = data.get('organisation', '')
        email = data.get('email', '')
        password = data.get('password', '')

        new_user = get_user_model().objects.create_user(email=email, password=password)
        new_user.save()

        #Create Wallet
        wallet_id = self.wallet_manager.create_wallet()

        new_user_profile = Profile(user=new_user, name=name, organisation=organisation, walletId=wallet_id)
        new_user_profile.save()

        # Work to be done on success decision here...
        return self.create_response(request, {'success': True})


class ProfileResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')
    wallet_manager = WalletManager()

    class Meta:
        queryset = Profile.objects.all()
        always_return_data = True
        resource_name = 'profile'
        allowed_methods = ['get', 'post']
        authorization = Authorization()

    def obj_create(self, bundle, **kwargs):
        bundle.data['user'] = bundle.request.user
        return super(ProfileResource, self).obj_create(bundle, **kwargs)

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/wallet$" %
                self._meta.resource_name,
                self.wrap_view('wallet'), name="api_wallet")
        ]

    def wallet(self, request, **kwargs):
        self.method_check(request, allowed=['get'])

        user = request.user
        profile = Profile.objects.get(user=user)
        wallet_id = profile.walletId

        balance = self.wallet_manager.get_balance(wallet_id)

        return self.create_response(request, {
            'success': True,
            'data': {'address': wallet_id, 'balance': balance}
        })


class CampaignResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'user')

    class Meta:
        queryset = Campaign.objects.all()
        always_return_data = True
        resource_name = 'campaign'
        allowed_methods = ['get', 'post']
        authorization = Authorization()

    def obj_create(self, bundle, **kwargs):
        bundle.data['user'] = bundle.request.user
        return super(CampaignResource, self).obj_create(bundle, **kwargs)


class AgentResource(ModelResource):
    campaign = fields.ForeignKey(CampaignResource, 'campaign')

    class Meta:
        queryset = Agent.objects.all()
        always_return_data = True
        resource_name = 'agent'
        allowed_methods = ['get', 'post']
        authorization = Authorization()

    def obj_create(self, bundle, **kwargs):
        campaign = Campaign.objects.get(id=bundle.data['campaign']['id'])
        campaign_owner = get_user_model().objects.get(campaign=campaign)
        if campaign_owner == bundle.request.user:
            return super(AgentResource, self).obj_create(bundle, **kwargs)


class AnonymousProfileResource(ModelResource):

    class Meta:
        queryset = AnonymousProfile.objects.all()
        always_return_data = True
        resource_name = 'anonprofile'
        allowed_methods = ['get', 'post']
        authorization = Authorization()

    def obj_create(self, bundle, **kwargs):
            return super(AnonymousProfileResource, self).obj_create(bundle, **kwargs)


class DemographicResource(ModelResource):
    agent = fields.ForeignKey(AgentResource, 'agent')

    class Meta:
        queryset = Demographic.objects.all()
        always_return_data = True
        resource_name = 'demographic'
        allowed_methods = ['get', 'post']
        authorization = Authorization()

    def obj_create(self, bundle, **kwargs):
        agent = Agent.objects.get(id=bundle.data['agent']['id'])
        agent_owner = get_user_model().objects.get(campaign=agent.campaign)
        if agent_owner == bundle.request.user:
            return super(DemographicResource, self).obj_create(bundle, **kwargs)


class AdvertResource(ModelResource):
    campaign = fields.ForeignKey(CampaignResource, 'campaign')
    media_manager = MediaManager(settings.MEDIA_ROOT)

    class Meta:
        queryset = Advert.objects.all()
        always_return_data = True
        resource_name = 'advert'
        allowed_methods = ['get', 'post']
        authorization = Authorization()

    def obj_create(self, bundle, **kwargs):
        campaign = Campaign.objects.get(id=bundle.data['campaign']['id'])
        campaign_owner = get_user_model().objects.get(campaign=campaign)
        if campaign_owner == bundle.request.user:
            return super(AdvertResource, self).obj_create(bundle, **kwargs)

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/upload$" %
                self._meta.resource_name,
                self.wrap_view('upload'), name="api_upload"),
        ]

    def upload(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        user_id = request.user.id
        img = request.FILES['file']
        file_name, file_ext = os.path.splitext(img.name)
        if file_ext not in ['.png', '.jpg', '.gif']:
            return self.create_response(request, {
                'success': False,
                'reason': 'Incorrect file format - png, jpg, and gif only'
            }, HttpForbidden)

        img_path = save_img(img, file_ext, user_id, self.media_manager)
        abs_img_path = "146.169.47.78:55052%s" % img_path
        return self.create_response(request, {
            'success': True,
            'image_path': abs_img_path
        })


# Save an image and return its relative location
def save_img(img, img_ext, uid, media_manager):
    space = media_manager.reserve_space(str(uid) + '/')
    # Check file extension here
    space += str(img_ext)

    fd = open(space, 'wb')
    for chunk in img.chunks():
        fd.write(chunk)
    fd.close()

    match = re.search('/media', space)
    return space[match.start():]


class PhoneUserResource(ModelResource):
    wallet_manager = WalletManager()

    class Meta:
        queryset = PhoneUser.objects.all()
        always_return_data = True
        resource_name = 'phoneuser'
        allowed_methods = ['get', 'post']
        authorization = Authorization()

    def obj_create(self, bundle, **kwargs):
        wallet_id = self.wallet_manager.create_wallet()
        bundle.data['waddress'] = wallet_id
        return super(PhoneUserResource, self).obj_create(bundle, **kwargs)