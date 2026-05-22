from rest_framework import serializers
from . import models

class DentalProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.DentalProduct
        fields = ['id', 'equipment_name', 'category']

class VendorStockListingSerializer(serializers.ModelSerializer):
    distributor = serializers.SerializerMethodField(read_only=True)
    product = DentalProductSerializer(read_only=True)
    class Meta:
        model = models.VendorStockListing
        fields = ['id', 'distributor', 'product', 'unit_price', 'quantity_available', 'created_at', 'updated_at']
    def get_distributor(self, obj):
        return obj.distributor.shop_name or obj.distributor.username

class ProcurementOrderSerializer(serializers.ModelSerializer):
    clinic = serializers.SerializerMethodField(read_only=True)
    listing = VendorStockListingSerializer(read_only=True)
    class Meta:
        model = models.ProcurementOrder
        fields = ['id', 'clinic', 'listing', 'total_invoice_cost', 'units_requested', 'created_at']

    def get_clinic(self, obj):
        return obj.clinic.shop_name or obj.clinic.username

