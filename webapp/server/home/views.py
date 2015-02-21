from django.shortcuts import render


def index(request):
    if request.user.is_authenticated():
        return render(request, 'user/userhome.html', {})
    else:
        return render(request, 'visitor/visitorhome.html', {})


def signin(request):
    if request.user.is_authenticated():
        return render(request, 'user/userhome.html', {})
    else:
        return render(request, 'visitor/signin.html', {})
