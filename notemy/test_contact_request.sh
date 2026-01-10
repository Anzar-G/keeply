#!/bin/bash

# Script to test contact request submission locally
echo "Testing Contact Request System..."

# Check if table exists
echo "1. Checking if contact_requests table exists..."
php artisan tinker --execute="
try {
    \$count = DB::table('contact_requests')->count();
    echo 'Table exists! Current records: ' . \$count . PHP_EOL;
} catch (\Exception \$e) {
    echo 'ERROR: Table does not exist - ' . \$e->getMessage() . PHP_EOL;
}
"

# Check if ContactRequest model works
echo -e "\n2. Testing ContactRequest model..."
php artisan tinker --execute="
try {
    \$test = new App\Models\ContactRequest();
    echo 'Model loaded successfully!' . PHP_EOL;
    echo 'Fillable fields: ' . implode(', ', \$test->getFillable()) . PHP_EOL;
} catch (\Exception \$e) {
    echo 'ERROR: Model issue - ' . \$e->getMessage() . PHP_EOL;
}
"

# Test creating a dummy record
echo -e "\n3. Testing record creation..."
php artisan tinker --execute="
try {
    \$contact = App\Models\Contact::first();
    if (\$contact) {
        \$request = App\Models\ContactRequest::create([
            'contact_id' => \$contact->id,
            'requester_name' => 'Test User',
            'requester_email' => 'test@example.com',
            'message' => 'Test message',
            'status' => 'pending',
            'ip_address' => '127.0.0.1'
        ]);
        echo 'SUCCESS! Created request ID: ' . \$request->id . PHP_EOL;
        
        // Clean up
        \$request->delete();
        echo 'Test record deleted.' . PHP_EOL;
    } else {
        echo 'ERROR: No contacts found in database' . PHP_EOL;
    }
} catch (\Exception \$e) {
    echo 'ERROR: ' . \$e->getMessage() . PHP_EOL;
    echo 'Trace: ' . \$e->getTraceAsString() . PHP_EOL;
}
"

echo -e "\n✅ Test complete!"
