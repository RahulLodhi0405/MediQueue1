
import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, Calendar, Bell, Check } from 'lucide-react';

interface HospitalData {
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
  lastUpdated: any;
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [hospitalData, setHospitalData] = useState<HospitalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'hospitalData', 'status'),
      (doc) => {
        if (doc.exists()) {
          setHospitalData(doc.data() as HospitalData);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching hospital data:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getTotalBloodUnits = () => {
    if (!hospitalData) return 0;
    return Object.values(hospitalData.bloodUnits).reduce((sum, units) => sum + units, 0);
  };

  const formatLastUpdated = () => {
    if (!hospitalData?.lastUpdated) return 'Never';
    return new Date(hospitalData.lastUpdated.toDate()).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {currentUser?.email?.split('@')[0]}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Hospital Resource Management Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blood Units</CardTitle>
            <Activity className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalBloodUnits()}</div>
            <p className="text-xs text-muted-foreground">
              Total units available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oxygen Cylinders</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalData?.oxygenCylinders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Cylinders in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(hospitalData?.icuBeds || 0) + (hospitalData?.generalBeds || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              ICU: {hospitalData?.icuBeds || 0} | General: {hospitalData?.generalBeds || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctors Available</CardTitle>
            <Check className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospitalData?.doctorsAvailable || 0}</div>
            <p className="text-xs text-muted-foreground">
              On duty now
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Last updated: {formatLastUpdated()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hospitalData && Object.entries(hospitalData.bloodUnits).map(([type, units]) => (
                <div key={type} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-semibold text-red-600">{type}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{units} units</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
