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
        fields = ['id', 'distributor', 'product', 'unit_price', 'quantity_available', 'created_at', 'updated_at', 'is_available']
    def get_distributor(self, obj):
        return obj.distributor.shop_name or obj.distributor.username

class ProcurementOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProcurementOrder
        fields = ['id', 'clinic', 'listing', 'total_invoice_cost', 'units_requested', 'created_at']

    def get_clinic(self, obj):
        return obj.clinic.shop_name or obj.clinic.username
    
    def validate(self, data):
        requested_amount = data.get('units_requested') # Maps to your units field
        listing_instance = data.get('listing')

        if listing_instance and requested_amount:
            available_stock = listing_instance.quantity_available

            if requested_amount > available_stock:
                raise serializers.ValidationError({
                    "quantity_kg": f"Allocation rejected. Only {available_stock} units available in vendor warehouse inventory."
                })
            
        return data


