<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(['category:id,name', 'seller:id,name'])
            ->orderByDesc('id');

        if ($request->filled('status')) {
            $request->validate([
                'status' => ['string', Rule::in(['draft', 'published', 'sold'])],
            ]);
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('search')) {
            $term = '%'.trim($request->input('search')).'%';
            $query->where(function ($subQuery) use ($term): void {
                $subQuery->where('title', 'like', $term)
                    ->orWhere('description', 'like', $term)
                    ->orWhereHas('seller', fn ($q) => $q->where('name', 'like', $term))
                    ->orWhereHas('category', fn ($q) => $q->where('name', 'like', $term));
            });
        }

        $perPage = min(max($request->integer('per_page', 10), 1), 100);
        $paginator = $query->paginate($perPage);

        $paginator->through(fn (Product $product) => [
            'id' => $product->id,
            'title' => $product->title,
            'price' => $product->price,
            'quantity' => $product->quantity,
            'status' => $product->status,
            'created_at' => $product->created_at?->toIso8601String(),
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->name,
            ] : null,
            'seller' => $product->seller ? [
                'id' => $product->seller->id,
                'name' => $product->seller->name,
            ] : null,
        ]);

        return response()->json([
            'data' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $product = Product::query()->withTrashed()->findOrFail($id);

        $data = $request->validate([
            'status' => ['required', 'string', Rule::in(['draft', 'published', 'sold'])],
        ]);

        $product->forceFill(['status' => $data['status']])->save();

        return response()->json([
            'product' => ['id' => $product->id, 'status' => $product->status],
            'message' => __('Statut produit mis à jour.'),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::query()->withTrashed()->findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        foreach ($product->images ?? [] as $path) {
            Storage::disk('public')->delete($path);
        }

        $product->forceDelete();

        return response()->json(['message' => __('Produit supprimé définitivement.')]);
    }
}
