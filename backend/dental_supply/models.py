from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# ==========================================
# 1. USER MODEL (Role-Based Authentication)
# ==========================================
class CustomUser(AbstractUser):
    CHOICES = (
        ('ADMINISTRATOR', 'System Admin'),
        ('DISTRIBUTOR', 'Distributor'),
        ('CLINIC', 'Clinic')
    )

    shop_name = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=13, null=True, blank=True)
    role = models.CharField(max_length=20, choices=CHOICES, default='CLINIC')

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"


# ==========================================
# 2. PRODUCT MASTER MODEL
# ==========================================
class DentalProduct(models.Model):
    CATEGORY_CHOICES = (
        ('ENDODONTIC', 'Endodontic'),
        ('RESTORATIVE', 'Restorative'),
        ('SURGICAL', 'Surgical'),
        ('DIAGNOSTIC', 'Diagnostic')
    )
    equipment_name = models.CharField(max_length=50, unique=True, db_index=True)
    category = models.CharField(max_length=55, choices=CATEGORY_CHOICES, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.equipment_name} - {self.get_category_display()}"
    
# ==========================================
# 3. PRICE LISTING MODEL
# ==========================================

class VendorStockListing(models.Model):
    distributor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role' : 'DISTRIBUTOR'}, related_name='listings')

    product = models.ForeignKey(DentalProduct, on_delete=models.CASCADE, related_name='listings')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.distributor.shop_name or self.distributor.username} - {self.product.equipment_name} : {self.unit_price} PKR/UNIT"

# ==========================================
# 4. ORDER MODEL
# ==========================================
class ProcurementOrder(models.Model):
    clinic = models.ForeignKey(CustomUser, limit_choices_to={'role':'CLINIC'}, db_index=True, on_delete=models.CASCADE, related_name='orders')

    listing = models.ForeignKey(VendorStockListing, related_name='orders', on_delete=models.CASCADE)
    units_requested = models.PositiveIntegerField()
    total_invoice_cost = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.total_invoice_cost = self.listing.unit_price * self.units_requested
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.clinic.shop_name or self.clinic.username} bought {self.units_requested} {self.listing.product.equipment_name} at {self.listing.unit_price} PKR/UNIT"


