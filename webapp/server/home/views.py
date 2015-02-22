from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.shortcuts import render


def index(request):
    if request.user.is_authenticated():
        return render(request, 'user/userhome.html', {})
    else:
        return render(request, 'visitor/visitorhome.html', {})


def signout(request):
    if request.user.is_authenticated():
        logout(request)
        return HttpResponseRedirect('/')
    else:
        return HttpResponseRedirect('/')


def signin(request):
    if request.user.is_authenticated():
        #Redirect user to index
        return HttpResponseRedirect('/')
    else:
        return render(request, 'visitor/signin.html', {})


def signup(request):
    if request.user.is_authenticated():
        #Redirect user to index
        return HttpResponseRedirect('/')
    else:
        return render(request, 'visitor/signup.html', {})
