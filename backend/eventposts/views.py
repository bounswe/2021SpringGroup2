from rest_framework.response import Response
from rest_framework import status
from .models import EventPost
from .serializers import EventPostSerializer
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination


class EventPostsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class EventPostView(APIView):
    
    def get(self, request, id):                
        try:           
            eventpost = EventPost.objects.get(id=id)
        except Exception as e:
            return Response(status=status.HTTP_204_NO_CONTENT)     
        return Response(EventPostSerializer(eventpost).data)


class EventPostViewAll(APIView):
    
    def get(self, request):                
        try:          
            posts = EventPost.objects.all()
        except:     
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer=EventPostSerializer(posts, many=True)

        return Response(serializer.data)


class EventPostPostView(APIView, EventPostsPagination):

    def get(self, request):
        try:
            posts = EventPost.objects.all()
            results = self.paginate_queryset(posts, request, view=self)
        except Exception as e:
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = EventPostSerializer(results, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = EventPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       
         
     

    
    





