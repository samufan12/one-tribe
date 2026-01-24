import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';

interface BecomeSellerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BecomeSellerModal = ({ open, onOpenChange }: BecomeSellerModalProps) => {
  const [formData, setFormData] = useState({
    business_name: '',
    business_address: '',
    business_phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { becomeSeller } = useUserRole();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_name || !formData.business_address || !formData.business_phone) {
      toast({
        title: "Error",
        description: "Please fill in all business information fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await becomeSeller(formData);
      toast({
        title: "Seller Request Submitted",
        description: "Your seller application has been submitted for admin review. You'll be notified once approved.",
      });
      onOpenChange(false);
      setFormData({ business_name: '', business_address: '', business_phone: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit seller application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply to Become a Seller</DialogTitle>
        </DialogHeader>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-primary mb-2">Application Process</h4>
          <p className="text-sm text-primary/80">
            Your seller application will be reviewed by our admin team. You'll be notified once approved and can then start listing items for sale.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="business_name">Business Name *</Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
              placeholder="Enter your business name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="business_address">Business Address *</Label>
            <Textarea
              id="business_address"
              value={formData.business_address}
              onChange={(e) => setFormData(prev => ({ ...prev, business_address: e.target.value }))}
              placeholder="Enter your business address"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="business_phone">Business Phone *</Label>
            <Input
              id="business_phone"
              type="tel"
              value={formData.business_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, business_phone: e.target.value }))}
              placeholder="Enter your business phone number"
              required
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Seller Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All business transactions must stay on the platform</li>
              <li>• Authentic traditional clothing only</li>
              <li>• Accurate item descriptions and photos required</li>
              <li>• Respectful communication with buyers</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting Application..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};