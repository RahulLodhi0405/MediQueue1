import React, { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ResourceData {
  bloodUnits: {
    'A+': number;
    'A-': number;
    'B+': number;
    'B-': number;
    'O+': number;
    'O-': number;
    'AB+': number;
    'AB-': number;
  };
  oxygenCylinders: number;
  icuBeds: number;
  generalBeds: number;
  doctorsAvailable: number;
}

const Resources = () => {
  const [data, setData] = useState<ResourceData>({
    bloodUnits: {
      'A+': 0,
      'A-': 0,
      'B+': 0,
      'B-': 0,
      'O+': 0,
      'O-': 0,
      'AB+': 0,
      'AB-': 0,
    },
    oxygenCylinders: 0,
    icuBeds: 0,
    generalBeds: 0,
    doctorsAvailable: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'hospitalData', 'status'),
      (doc) => {
        if (doc.exists()) {
          const docData = doc.data();
          setData({
            bloodUnits: docData.bloodUnits || data.bloodUnits,
            oxygenCylinders: docData.oxygenCylinders || 0,
            icuBeds: docData.icuBeds || 0,
            generalBeds: docData.generalBeds || 0,
            doctorsAvailable: docData.doctorsAvailable || 0,
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handleBloodUnitChange = (bloodType: keyof typeof data.bloodUnits, value: string) => {
    const numValue = parseInt(value) || 0;
    setData(prev => ({
      ...prev,
      bloodUnits: {
        ...prev.bloodUnits,
        [bloodType]: numValue
      }
    }));
  };

  const handleInputChange = (field: keyof Omit<ResourceData, 'bloodUnits'>, value: string) => {
    const numValue = parseInt(value) || 0;
    setData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setDoc(doc(db, 'hospitalData', 'status'), {
        ...data,
        lastUpdated: serverTimestamp()
      });

      toast({
        title: "Success",
        description: "Hospital resources updated successfully"
      });
    } catch (error) {
      console.error('Error updating resources:', error);
      toast({
        title: "Error",
        description: "Failed to update resources",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Resource Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update hospital resource availability
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Blood Units */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-red-600">🩸</span>
              <span>Blood Units</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(data.bloodUnits).map(([bloodType, units]) => (
                <div key={bloodType} className="space-y-2">
                  <Label htmlFor={`blood-${bloodType}`}>{bloodType}</Label>
                  <Input
                    id={`blood-${bloodType}`}
                    type="number"
                    min="0"
                    value={units}
                    onChange={(e) => handleBloodUnitChange(bloodType as keyof typeof data.bloodUnits, e.target.value)}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Other Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>💨</span>
                <span>Oxygen Cylinders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="oxygen">Stock Count</Label>
                <Input
                  id="oxygen"
                  type="number"
                  min="0"
                  value={data.oxygenCylinders}
                  onChange={(e) => handleInputChange('oxygenCylinders', e.target.value)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🩺</span>
                <span>Doctors Available</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="doctors">On Duty</Label>
                <Input
                  id="doctors"
                  type="number"
                  min="0"
                  value={data.doctorsAvailable}
                  onChange={(e) => handleInputChange('doctorsAvailable', e.target.value)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🛏</span>
                <span>ICU Beds</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="icu">Available Count</Label>
                <Input
                  id="icu"
                  type="number"
                  min="0"
                  value={data.icuBeds}
                  onChange={(e) => handleInputChange('icuBeds', e.target.value)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🛌</span>
                <span>General Beds</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="general">Available Count</Label>
                <Input
                  id="general"
                  type="number"
                  min="0"
                  value={data.generalBeds}
                  onChange={(e) => handleInputChange('generalBeds', e.target.value)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="px-8">
            {loading ? "Updating..." : "Update Resources"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Resources;
