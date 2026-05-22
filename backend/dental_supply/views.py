from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DentalProduct, ProcurementOrder, VendorStockListing
from .serializers import ProcurementOrderSerializer, DentalProductSerializer, VendorStockListingSerializer

class ProductListAPIView(APIView):
     def get(self, request):
        items = DentalProduct.objects.all()
        serializer = DentalProductSerializer(items, many=True)
        return Response(serializer.data)
     
class PriceListAPIView(APIView):
    def get(self, request):
        items = VendorStockListing.objects.filter(is_available=True)
        serializer = VendorStockListingSerializer(items, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = VendorStockListingSerializer(request)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderListAPIView(APIView):
    def get(self, request):
        items = ProcurementOrder.objects.all()
        serializer = ProcurementOrderSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProcurementOrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
